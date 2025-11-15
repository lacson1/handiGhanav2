import express from 'express'
import {
  getOrCreateChat,
  getUserChats,
  sendMessage,
  markAsRead,
  getChatMessages
} from '../controllers/chatController'

const router = express.Router()

// POST /api/chat - Get or create chat
router.post('/', getOrCreateChat)

// GET /api/chat - Get all chats for user
router.get('/', getUserChats)

// GET /api/chat/:chatId/messages - Get messages for a chat
router.get('/:chatId/messages', getChatMessages)

// POST /api/chat/:chatId/messages - Send a message
router.post('/:chatId/messages', sendMessage)

// PUT /api/chat/:chatId/read - Mark messages as read
router.put('/:chatId/read', markAsRead)

export default router

