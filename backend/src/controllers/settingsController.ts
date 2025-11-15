import { Response } from 'express'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { AuthRequest } from '../middleware/auth'
import { prisma } from '../lib/prisma'

// Get user settings
export const getSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found. Please authenticate.' })
    }

    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    })

    // If no settings exist, create default settings
    if (!settings) {
      try {
        settings = await prisma.userSettings.create({
          data: {
            userId,
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingReminders: true,
            promotions: false,
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false
          }
        })
      } catch (createError: unknown) {
        // If creation fails (e.g., user doesn't exist), return error
        console.error('Create settings error:', createError)
        if (createError instanceof Prisma.PrismaClientKnownRequestError && createError.code === 'P2003') {
          return res.status(404).json({ message: 'User not found' })
        }
        throw createError
      }
    }

    res.json(settings)
  } catch (error: unknown) {
    console.error('Get settings error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        meta: error.meta,
        stack: error.stack
      })
      
      // Handle specific Prisma errors
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Settings already exist for this user' })
      }
      if (error.code === 'P2003') {
        return res.status(404).json({ message: 'User not found' })
      }
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Settings not found' })
      }
      
      return res.status(500).json({ 
        message: error.message || 'Failed to get settings',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        code: error.code
      })
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to get settings'
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
}

// Update user settings
export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found. Please authenticate.' })
    }

    const {
      emailNotifications,
      smsNotifications,
      pushNotifications,
      bookingReminders,
      promotions,
      profileVisibility,
      showEmail,
      showPhone
    } = req.body

    // Validate profileVisibility if provided
    if (profileVisibility && !['public', 'private'].includes(profileVisibility)) {
      return res.status(400).json({ message: 'profileVisibility must be "public" or "private"' })
    }

    // Build update object - only include fields that are provided (not undefined)
    const updateData: {
      emailNotifications?: boolean
      smsNotifications?: boolean
      pushNotifications?: boolean
      bookingReminders?: boolean
      promotions?: boolean
      profileVisibility?: 'public' | 'private'
      showEmail?: boolean
      showPhone?: boolean
    } = {}
    if (emailNotifications !== undefined) updateData.emailNotifications = emailNotifications
    if (smsNotifications !== undefined) updateData.smsNotifications = smsNotifications
    if (pushNotifications !== undefined) updateData.pushNotifications = pushNotifications
    if (bookingReminders !== undefined) updateData.bookingReminders = bookingReminders
    if (promotions !== undefined) updateData.promotions = promotions
    if (profileVisibility) updateData.profileVisibility = profileVisibility
    if (showEmail !== undefined) updateData.showEmail = showEmail
    if (showPhone !== undefined) updateData.showPhone = showPhone

    // If no fields to update, just return existing settings
    if (Object.keys(updateData).length === 0) {
      const existingSettings = await prisma.userSettings.findUnique({
        where: { userId }
      })
      
      if (!existingSettings) {
        // Create default settings if none exist
        const newSettings = await prisma.userSettings.create({
          data: {
            userId,
            emailNotifications: true,
            smsNotifications: false,
            pushNotifications: true,
            bookingReminders: true,
            promotions: false,
            profileVisibility: 'public',
            showEmail: false,
            showPhone: false
          }
        })
        return res.json({ message: 'Settings created successfully', settings: newSettings })
      }
      
      return res.json({ message: 'No changes to update', settings: existingSettings })
    }

    // Upsert settings (create if doesn't exist, update if exists)
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true,
        smsNotifications: smsNotifications !== undefined ? smsNotifications : false,
        pushNotifications: pushNotifications !== undefined ? pushNotifications : true,
        bookingReminders: bookingReminders !== undefined ? bookingReminders : true,
        promotions: promotions !== undefined ? promotions : false,
        profileVisibility: profileVisibility || 'public',
        showEmail: showEmail !== undefined ? showEmail : false,
        showPhone: showPhone !== undefined ? showPhone : false
      }
    })

    res.json({ message: 'Settings updated successfully', settings })
  } catch (error: unknown) {
    console.error('Update settings error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2003') {
        return res.status(404).json({ message: 'User not found' })
      }
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Settings conflict. Please try again.' })
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to update settings'
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
}

// Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId

    if (!userId) {
      return res.status(401).json({ message: 'User ID not found. Please authenticate.' })
    }

    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' })
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if user has a password (OAuth users might not have a password)
    if (!user.password) {
      return res.status(400).json({ 
        message: 'This account uses social login. Password cannot be changed.' 
      })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    })

    res.json({ message: 'Password changed successfully' })
  } catch (error: unknown) {
    console.error('Change password error:', error)
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'User not found' })
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to change password'
    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
}

export default {
  getSettings,
  updateSettings,
  changePassword
}

