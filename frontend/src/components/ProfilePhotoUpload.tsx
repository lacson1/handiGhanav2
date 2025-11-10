import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { uploadApi } from '../lib/api'
import { userService } from '../services/userService'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import { cn } from '../lib/utils'

interface ProfilePhotoUploadProps {
  currentAvatar?: string
  onUpdate?: (avatarUrl: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function ProfilePhotoUpload({
  currentAvatar,
  onUpdate,
  size = 'md',
  className
}: ProfilePhotoUploadProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const result = await uploadApi.uploadImage(file, 'profiles')
      
      if (!result || !result.url) {
        throw new Error('Upload succeeded but no URL returned')
      }
      
      // Update user profile
      if (user) {
        await userService.updateProfile({ avatar: result.url })
        
        // Update local storage
        const updatedUser = { ...user, avatar: result.url }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Update auth context if onUpdate is provided
        if (onUpdate) {
          onUpdate(result.url)
        } else {
          // Refresh the page to update context
          window.location.reload()
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      const errorMessage = error?.message || 'Failed to upload image. Please try again.'
      alert(errorMessage)
      setPreview(currentAvatar || null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!confirm('Remove profile photo?')) return

    try {
      if (user) {
        await userService.updateProfile({ avatar: '' })
        
        // Update local storage
        const updatedUser = { ...user, avatar: undefined }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        if (onUpdate) {
          onUpdate('')
        } else {
          window.location.reload()
        }
      }
      setPreview(null)
    } catch (error: any) {
      console.error('Remove error:', error)
      alert('Failed to remove photo. Please try again.')
    }
  }

  return (
    <div className={cn('relative inline-block', className)}>
      <div className={cn(
        'relative rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700',
        sizeClasses[size]
      )}>
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary flex items-center justify-center text-white font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          </div>
        )}
      </div>

      <div className="absolute bottom-0 right-0 flex gap-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
        {preview && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 border-2 border-red-300 dark:border-red-600"
            onClick={handleRemove}
            disabled={uploading}
          >
            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
          </Button>
        )}
      </div>
    </div>
  )
}

