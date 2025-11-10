import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export function useWebSocket(roomId?: string) {
  const socketRef = useRef<Socket | null>(null)
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('WebSocket connected')
      
      // Join provider or user room
      if (user?.role === 'PROVIDER' && user?.id) {
        socket.emit('join-room', `provider-${user.id}`)
      } else if (user?.id) {
        socket.emit('join-room', `user-${user.id}`)
      }

      if (roomId) {
        socket.emit('join-room', roomId)
      }
    })

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    return () => {
      socket.disconnect()
    }
  }, [isAuthenticated, user, roomId])

  return socketRef.current
}

