import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Get user settings
export const getSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId

    let settings = await prisma.userSettings.findUnique({
      where: { userId }
    })

    // If no settings exist, create default settings
    if (!settings) {
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
    }

    res.json(settings)
  } catch (error: any) {
    console.error('Get settings error:', error)
    res.status(500).json({ message: 'Failed to get settings', error: error.message })
  }
}

// Update user settings
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
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

    // Upsert settings (create if doesn't exist, update if exists)
    const settings = await prisma.userSettings.upsert({
      where: { userId },
      update: {
        emailNotifications: emailNotifications !== undefined ? emailNotifications : undefined,
        smsNotifications: smsNotifications !== undefined ? smsNotifications : undefined,
        pushNotifications: pushNotifications !== undefined ? pushNotifications : undefined,
        bookingReminders: bookingReminders !== undefined ? bookingReminders : undefined,
        promotions: promotions !== undefined ? promotions : undefined,
        profileVisibility: profileVisibility || undefined,
        showEmail: showEmail !== undefined ? showEmail : undefined,
        showPhone: showPhone !== undefined ? showPhone : undefined
      },
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
  } catch (error: any) {
    console.error('Update settings error:', error)
    res.status(500).json({ message: 'Failed to update settings', error: error.message })
  }
}

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
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
  } catch (error: any) {
    console.error('Change password error:', error)
    res.status(500).json({ message: 'Failed to change password', error: error.message })
  }
}

export default {
  getSettings,
  updateSettings,
  changePassword
}

