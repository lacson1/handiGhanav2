import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getMockUserByEmail, getMockUserById, MockUser } from '../data/mockData'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-in-production') {
  console.warn('⚠️  WARNING: JWT_SECRET is not set or using default value. Please set a strong secret in production!')
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role } = req.body

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    // Check if user already exists
    const existingUser = getMockUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user (in real app, save to database)
    const newUser: Omit<MockUser, 'avatar'> = {
      id: `user-${Date.now()}`,
      email: email.toLowerCase().trim(),
      name: name.trim(),
      phone: phone?.trim(),
      role: role || 'CUSTOMER',
      password: hashedPassword
    }

    // TODO: Save to database with Prisma
    // const user = await prisma.user.create({ data: { ... } })

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed'
    console.error('Registration error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' })
    }

    // Find user by email
    const user = getMockUserByEmail(email.toLowerCase().trim())
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Verify password - always use bcrypt.compare for security
    // Check if password is hashed (starts with $2a$ or $2b$)
    const isHashed = user.password.startsWith('$2a$') || user.password.startsWith('$2b$')
    
    let isValidPassword = false
    if (isHashed) {
      // Password is hashed, use bcrypt.compare
      isValidPassword = await bcrypt.compare(password, user.password)
    } else {
      // Legacy plain text password (for mock data only) - hash it and compare
      // In production, all passwords should be hashed
      isValidPassword = user.password === password
      // If valid, we should hash it for future use (but we can't update mock data here)
    }

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Login failed'
    console.error('Login error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' })
    }

    // Extract user ID from JWT token (if middleware is set up)
    // For now, get from header or use default
    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
        userId = decoded.userId
      } catch (err) {
        // Invalid token
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getMockUserById(userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile'
    console.error('Get profile error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' })
    }

    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as { userId?: string }
        userId = decoded.userId
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getMockUserById(userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user fields with validation
    const { name, phone, avatar } = req.body
    
    if (name !== undefined) {
      const trimmedName = name.trim()
      if (trimmedName.length === 0) {
        return res.status(400).json({ message: 'Name cannot be empty' })
      }
      user.name = trimmedName
    }
    
    if (phone !== undefined) {
      user.phone = phone?.trim() || undefined
    }
    
    if (avatar !== undefined) {
      user.avatar = avatar?.trim() || undefined
    }

    // TODO: Save to database with Prisma
    // await prisma.user.update({ where: { id: userId }, data: { name, phone, avatar } })

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
    console.error('Update profile error:', error)
    res.status(500).json({ message: errorMessage })
  }
}

