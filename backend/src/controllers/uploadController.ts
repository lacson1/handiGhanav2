import { Request, Response } from 'express'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (should be in .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
})

export const uploadImage = async (req: Request, res: Response) => {
  try {
    // Check Cloudinary configuration
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo'
    const apiKey = process.env.CLOUDINARY_API_KEY || 'demo'
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'demo'
    const isDemoMode = cloudName === 'demo' || apiKey === 'demo' || apiSecret === 'demo'

    console.log('Upload request received:', {
      hasFile: !!req.file,
      fileSize: req.file?.size,
      mimetype: req.file?.mimetype,
      folder: req.body?.folder,
      contentType: req.headers['content-type'],
      isDemoMode,
      bodyKeys: Object.keys(req.body || {}),
      files: Object.keys(req.files || {})
    })

    if (!req.file) {
      console.error('No file in request. Request details:', {
        headers: req.headers,
        body: req.body,
        files: req.files
      })
      return res.status(400).json({ message: 'No file uploaded. Please select an image file.' })
    }

    const folder = req.body.folder || 'providers'

    // Validate file type
    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ message: 'Invalid file type. Please upload an image file.' })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' })
    }

    // Development mode: Return mock URL if Cloudinary is not configured
    if (isDemoMode && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Cloudinary is using demo credentials. Returning mock URL for development.')
      
      // Create a data URL from the file buffer for preview
      const base64 = req.file.buffer.toString('base64')
      const dataUrl = `data:${req.file.mimetype};base64,${base64}`
      
      return res.json({
        url: dataUrl,
        publicId: `mock-${Date.now()}`,
        message: 'Development mode: File uploaded as data URL. Configure Cloudinary for production.'
      })
    }

    if (isDemoMode) {
      return res.status(500).json({ 
        message: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'
      })
    }

    // Convert buffer to base64
    const base64 = req.file.buffer.toString('base64')
    const dataUri = `data:${req.file.mimetype};base64,${base64}`

    console.log('Uploading to Cloudinary...')
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: `handyghana/${folder}`,
      resource_type: 'image',
    })

    console.log('Upload successful:', result.secure_url)

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    })
  } catch (error: unknown) {
    console.error('Upload error:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Upload failed'
    if (error instanceof Error) {
      if (error.message?.includes('Invalid API Key')) {
        errorMessage = 'Cloudinary configuration error. Please check your API credentials.'
      } else if (error.message?.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.'
      } else {
        errorMessage = error.message || 'Upload failed. Please try again.'
      }
    }

    res.status(500).json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
    })
  }
}

