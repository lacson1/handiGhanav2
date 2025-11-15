import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { io } from '../server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// In-memory store for chats (in production, use database)
interface Chat {
  id: string
  customerId: string
  providerId: string
  bookingId?: string
  lastMessage?: string
  lastMessageAt?: string
  createdAt: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  messageType: string
  fileUrl?: string
  isRead: boolean
  readAt?: string
  createdAt: string
}

let chatsStore: Chat[] = []
let messagesStore: Message[] = []

// Get or create chat between customer and provider
export const getOrCreateChat = async (req: Request, res: Response) => {
  try {
    const { providerId, bookingId } = req.body
    
    // Get user ID from JWT token
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    const customerId = decoded.userId

    if (!customerId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (!providerId) {
      return res.status(400).json({ message: 'Provider ID is required' })
    }

    // Check if chat already exists
    let chat = chatsStore.find(
      c => c.customerId === customerId && c.providerId === providerId
    )

    if (!chat) {
      // Create new chat
      chat = {
        id: `chat-${Date.now()}`,
        customerId,
        providerId,
        bookingId: bookingId || undefined,
        createdAt: new Date().toISOString()
      }
      chatsStore.push(chat)
    }

    // Get messages for this chat
    const messages = messagesStore
      .filter(m => m.chatId === chat!.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    res.json({
      chat,
      messages
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get/create chat'
    console.error('Chat operation error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// Get all chats for a user
export const getUserChats = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    const userId = decoded.userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Get all chats where user is customer or provider
    const userChats = chatsStore.filter(
      c => c.customerId === userId || c.providerId === userId
    )

    // Get last message for each chat
    const chatsWithLastMessage = userChats.map(chat => {
      const lastMessage = messagesStore
        .filter(m => m.chatId === chat.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

      return {
        ...chat,
        lastMessage: lastMessage?.content,
        lastMessageAt: lastMessage?.createdAt
      }
    })

    res.json({ chats: chatsWithLastMessage })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get chats'
    console.error('Get chats error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// Send a message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, content, messageType = 'text', fileUrl } = req.body

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    const senderId = decoded.userId

    if (!senderId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (!chatId || !content) {
      return res.status(400).json({ message: 'Chat ID and content are required' })
    }

    // Find chat
    const chat = chatsStore.find(c => c.id === chatId)
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    // Determine receiver
    const receiverId = chat.customerId === senderId ? chat.providerId : chat.customerId

    // Create message
    const message: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      receiverId,
      content,
      messageType,
      fileUrl,
      isRead: false,
      createdAt: new Date().toISOString()
    }

    messagesStore.push(message)

    // Update chat's last message
    chat.lastMessage = content
    chat.lastMessageAt = message.createdAt

    // Emit real-time message via WebSocket
    io.to(`chat-${chatId}`).emit('new-message', message)
    io.to(`user-${receiverId}`).emit('new-message-notification', {
      chatId,
      message,
      senderId
    })

    res.status(201).json(message)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message'
    console.error('Send message error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// Mark messages as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    const userId = decoded.userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Mark all unread messages in this chat as read (where user is receiver)
    const unreadMessages = messagesStore.filter(
      m => m.chatId === chatId && m.receiverId === userId && !m.isRead
    )

    unreadMessages.forEach(msg => {
      msg.isRead = true
      msg.readAt = new Date().toISOString()
    })

    res.json({ 
      message: 'Messages marked as read',
      count: unreadMessages.length
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to mark as read'
    console.error('Mark as read error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

// Get messages for a chat
export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params

    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
    const userId = decoded.userId

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    // Verify user is part of this chat
    const chat = chatsStore.find(c => c.id === chatId)
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    if (chat.customerId !== userId && chat.providerId !== userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    // Get messages
    const messages = messagesStore
      .filter(m => m.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    res.json({ messages })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get messages'
    console.error('Get messages error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

