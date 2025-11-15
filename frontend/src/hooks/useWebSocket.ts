import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

// Construct WebSocket URL from API URL or use explicit WebSocket URL
const getSocketUrl = () => {
  // Use explicit WebSocket URL if provided
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL
  }
  
  // Otherwise, construct from API URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  // Remove /api suffix if present and convert http/https to ws/wss
  const baseUrl = apiUrl.replace(/\/api$/, '').replace(/^http:/, 'ws:').replace(/^https:/, 'wss:')
  return baseUrl
}

const SOCKET_URL = getSocketUrl()

export function useWebSocket(roomId?: string) {
  const socketRef = useRef<Socket | null>(null)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      return
    }

    // Disconnect existing socket if any
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }

    // Initialize socket connection with error handling
    // Allow both websocket and polling transports for better compatibility
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'], // Allow polling as fallback
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000, // Increase timeout for production
      forceNew: false,
      upgrade: true, // Allow transport upgrades
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      // WebSocket connected
      
      // Join provider or user room
      if (user?.role === 'PROVIDER' && user?.id) {
        socket.emit('join-room', `provider-${user.id}`)
      } else if (user?.role === 'ADMIN') {
        socket.emit('join-room', 'admin-room')
      } else if (user?.id) {
        socket.emit('join-room', `user-${user.id}`)
      }

      if (roomId) {
        socket.emit('join-room', roomId)
      }
    })

    socket.on('disconnect', () => {
      // WebSocket disconnected
    })

    socket.on('connect_error', (error) => {
      // Log connection errors for debugging
      console.error('WebSocket connection error:', error.message)
      // Don't spam console in production, but log for debugging
    })
    
    socket.on('reconnect_attempt', () => {
      if (import.meta.env.DEV) {
        console.log('Attempting to reconnect WebSocket...')
      }
    })
    
    socket.on('reconnect', (attemptNumber) => {
      if (import.meta.env.DEV) {
        console.log(`WebSocket reconnected after ${attemptNumber} attempts`)
      }
    })
    
    socket.on('reconnect_failed', () => {
      console.error('WebSocket reconnection failed after all attempts')
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, user?.id, user?.role, roomId])

  return socketRef.current
}

