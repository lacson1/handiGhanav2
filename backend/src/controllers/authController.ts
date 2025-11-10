import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getMockUserByEmail, getMockUserById, mockUsers } from '../data/mockData'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role } = req.body

    // Check if user already exists
    const existingUser = getMockUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user (in real app, save to database)
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      phone,
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = getMockUserByEmail(email)
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Verify password (for mock users, check plain password; in production, use bcrypt.compare)
    const isValidPassword = user.password === password || 
      await bcrypt.compare(password, user.password).catch(() => false)

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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    // Extract user ID from JWT token (if middleware is set up)
    // For now, get from header or use default
    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (err) {
        // Invalid token
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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization
    let userId: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7)
        const decoded = jwt.verify(token, JWT_SECRET) as any
        userId = decoded.userId
      } catch (err) {
        // Invalid token
      }
    }

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const user = getMockUserById(userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user fields
    const { name, phone, avatar } = req.body
    
    if (name) user.name = name
    if (phone !== undefined) user.phone = phone
    if (avatar !== undefined) user.avatar = avatar

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
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

