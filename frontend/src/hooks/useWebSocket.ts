import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

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
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000,
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
      // Silently handle WebSocket errors - backend might not be running (normal in dev)
      if (import.meta.env.DEV) {
        console.error('WebSocket connection error:', error)
      }
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

