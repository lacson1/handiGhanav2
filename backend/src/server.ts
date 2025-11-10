import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'
import providerRoutes from './routes/providers'
import bookingRoutes from './routes/bookings'
import authRoutes from './routes/auth'
import uploadRoutes from './routes/upload'
import paymentRoutes from './routes/payments'
import reviewRoutes from './routes/reviews'
import serviceRoutes from './routes/services'
import subscriptionRoutes from './routes/subscriptions'
import payoutRoutes from './routes/payouts'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

const PORT = Number(process.env.PORT) || 3001

// Middleware
app.use(cors())

// Body parsers - exclude upload routes as multer handles multipart/form-data
app.use((req, res, next) => {
  if (req.path.startsWith('/api/upload')) {
    return next() // Skip body parsing for upload routes
  }
  express.json({ limit: '50mb' })(req, res, next)
})

app.use((req, res, next) => {
  if (req.path.startsWith('/api/upload')) {
    return next() // Skip body parsing for upload routes
  }
  express.urlencoded({ extended: true, limit: '50mb' })(req, res, next)
})

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HandyGhana API is running' })
})

app.use('/api/providers', providerRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/payouts', payoutRoutes)

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    console.log(`Client ${socket.id} joined room: ${roomId}`)
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

// Export io for use in controllers
export { io }

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
  console.log(`📡 WebSocket server ready`)
})

export default app

