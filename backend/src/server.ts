import express from 'express'
import cors from 'cors'
import compression from 'compression'
import dotenv from 'dotenv'
import session from 'express-session'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { initSentry } from './config/sentry'
import Sentry from '@sentry/node'
import passport from './config/passport'
import providerRoutes from './routes/providers'
import bookingRoutes from './routes/bookings'
import authRoutes from './routes/auth'
import oauthRoutes from './routes/oauth'
import uploadRoutes from './routes/upload'
import paymentRoutes from './routes/payments'
import reviewRoutes from './routes/reviews'
import serviceRoutes from './routes/services'
import subscriptionRoutes from './routes/subscriptions'
import payoutRoutes from './routes/payouts'
import statsRoutes from './routes/stats'
import testRoutes from './routes/test'
import adminRoutes from './routes/admin'

dotenv.config()

// Initialize Sentry for error tracking
initSentry()

const app = express()
const httpServer = createServer(app)

// Allowed origins for CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://handighana.com',
  'https://www.handighana.com',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

const PORT = Number(process.env.PORT) || 3001

// Middleware
// Enable gzip compression for all responses
app.use(compression({
  level: 6, // Compression level (0-9, where 9 is maximum compression)
  threshold: 1024, // Only compress responses larger than 1KB
}))

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(null, true) // For now, allow all. Change to false in production if needed
    }
  },
  credentials: true,
}))

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

// Session middleware for OAuth
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'HandyGhana API is running' })
})

app.use('/api/providers', providerRoutes)
app.use('/api/bookings', bookingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/auth', oauthRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/payouts', payoutRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/test', testRoutes)
app.use('/api/admin', adminRoutes)

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

// Error handling middleware (Sentry will catch errors automatically)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  // Sentry will automatically capture this error
  Sentry.captureException(err)
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

