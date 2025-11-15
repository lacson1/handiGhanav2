import { useState, useEffect, useRef } from 'react'
import { X, Send, Paperclip, Image as ImageIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { chatApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useWebSocket } from '../hooks/useWebSocket'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface Message {
  id: string
  chatId: string
  senderId: string
  receiverId: string
  content: string
  messageType: string
  fileUrl?: string
  isRead: boolean
  createdAt: string
}

interface ChatWindowProps {
  chatId: string
  providerId?: string
  providerName?: string
  customerId?: string
  customerName?: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatWindow({
  chatId,
  providerId,
  providerName,
  customerId,
  customerName,
  isOpen,
  onClose
}: ChatWindowProps) {
  const { user } = useAuth()
  const socket = useWebSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const currentUserId = user?.id
  const otherUserName = user?.id === providerId ? customerName : providerName

  // Load messages
  useEffect(() => {
    if (isOpen && chatId) {
      loadMessages()
      joinChatRoom()
      markAsRead()
    }

    return () => {
      // Cleanup handled by socket disconnection
    }
  }, [isOpen, chatId])

  // Listen for new messages
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message: Message) => {
      if (message.chatId === chatId) {
        setMessages(prev => [...prev, message])
        scrollToBottom()
        if (message.receiverId === currentUserId) {
          markAsRead()
        }
      }
    }

    socket.on('new-message', handleNewMessage)

    return () => {
      socket.off('new-message', handleNewMessage)
    }
  }, [socket, chatId, currentUserId])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const response = await chatApi.getChatMessages(chatId)
      setMessages(response.messages || [])
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const joinChatRoom = () => {
    if (socket && chatId) {
      socket.emit('join-chat', chatId)
      // Also join user room for notifications
      if (currentUserId) {
        socket.emit('join-room', `user-${currentUserId}`)
      }
    }
  }

  const markAsRead = async () => {
    try {
      await chatApi.markAsRead(chatId)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    try {
      const message = await chatApi.sendMessage(chatId, newMessage.trim())
      setMessages(prev => [...prev, message])
      setNewMessage('')
      scrollToBottom()
    } catch (error) {
      console.error('Failed to send message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' })
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {otherUserName || 'Chat'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {messages.length} messages
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === currentUserId
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      isOwn ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] rounded-2xl px-4 py-2",
                        isOwn
                          ? "bg-primary text-black"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                      {message.fileUrl && (
                        <div className="mt-2">
                          <img
                            src={message.fileUrl}
                            alt="Attachment"
                            className="max-w-full rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-xs mt-1 opacity-70">
                        {formatTime(message.createdAt)}
                        {isOwn && message.isRead && (
                          <span className="ml-1">✓✓</span>
                        )}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Attach file"
              >
                <Paperclip className="h-5 w-5 text-gray-500" />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || sending}
                size="sm"
                className="min-w-[80px]"
              >
                {sending ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

