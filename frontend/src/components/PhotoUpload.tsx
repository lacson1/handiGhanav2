import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadApi } from '../lib/api'

interface PhotoUploadProps {
  onUpload: (urls: string[]) => void
  maxPhotos?: number
  folder?: string
  accept?: string
  maxSizeMB?: number
  multiple?: boolean
  previewUrls?: string[]
  className?: string
  label?: string
  helperText?: string
}

export default function PhotoUpload({
  onUpload,
  maxPhotos = 5,
  folder = 'uploads',
  accept = 'image/*',
  maxSizeMB = 5,
  multiple = true,
  previewUrls = [],
  className = '',
  label = 'Upload Photos',
  helperText
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<string[]>(previewUrls)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the limit
    const remainingSlots = maxPhotos - photos.length
    if (remainingSlots <= 0) {
      setError(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    // Validate files
    for (const file of filesToUpload) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return
      }

      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Each file must be less than ${maxSizeMB}MB`)
        return
      }
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]
        const result = await uploadApi.uploadImage(file, folder)
        uploadedUrls.push(result.url)
        setUploadProgress(((i + 1) / filesToUpload.length) * 100)
      }

      const newPhotos = [...photos, ...uploadedUrls]
      setPhotos(newPhotos)
      onUpload(newPhotos)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    setPhotos(newPhotos)
    onUpload(newPhotos)
    setError(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      // Create a fake event to reuse the handleFileSelect logic
      const fakeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {photos.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
            >
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                {index + 1} / {maxPhotos}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {photos.length < maxPhotos && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple && photos.length < maxPhotos - 1}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="photo-upload-input"
          />
          <label
            htmlFor="photo-upload-input"
            className={`
              flex flex-col items-center justify-center w-full min-h-[200px] 
              border-2 border-dashed rounded-xl cursor-pointer 
              transition-all duration-200
              ${uploading 
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 cursor-not-allowed' 
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }
            `}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
              {uploading ? (
                <>
                  <Loader2 className="h-12 w-12 text-blue-500 mb-4 animate-spin" />
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                    Uploading... {Math.round(uploadProgress)}%
                  </p>
                  <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </>
              ) : photos.length === 0 ? (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    {helperText || `PNG, JPG, GIF up to ${maxSizeMB}MB (max ${maxPhotos} photos)`}
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-3" />
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Add more photos
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {photos.length} / {maxPhotos} uploaded
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <X className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      {/* Helper Text */}
      {!error && helperText && photos.length === 0 && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {/* Photos Counter */}
      {photos.length > 0 && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {photos.length} of {maxPhotos} photos uploaded
        </p>
      )}
    </div>
  )
}

