import { useState } from 'react'
import { Upload, CheckCircle, XCircle, FileText, Camera, User, AlertCircle } from 'lucide-react'
import { uploadApi } from '../lib/api'
import Button from './ui/Button'

interface ProviderVerificationProps {
  providerId?: string
  onComplete?: () => void
}

type VerificationStep = 'id' | 'references' | 'portfolio' | 'review'

export default function ProviderVerification({ providerId: _providerId, onComplete }: ProviderVerificationProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>('id')
  const [verificationData, setVerificationData] = useState({
    idDocument: null as File | null,
    idDocumentUrl: '',
    references: ['', ''],
    workPhotos: [] as File[],
    workPhotosUrls: [] as string[],
    workVideos: [] as File[],
    workVideosUrls: [] as string[]
  })
  const [uploading, setUploading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps: { key: VerificationStep; label: string; icon: React.ReactNode }[] = [
    { key: 'id', label: 'ID Verification', icon: <FileText className="h-5 w-5" /> },
    { key: 'references', label: 'References', icon: <User className="h-5 w-5" /> },
    { key: 'portfolio', label: 'Portfolio', icon: <Camera className="h-5 w-5" /> },
    { key: 'review', label: 'Review', icon: <CheckCircle className="h-5 w-5" /> }
  ]

  const handleFileUpload = async (file: File, type: 'id' | 'photo' | 'video') => {
    setUploading(true)
    try {
      const folder = type === 'id' ? 'verification' : 'portfolio'
      const response = await uploadApi.uploadImage(file, folder)
      
      if (type === 'id') {
        setVerificationData({ ...verificationData, idDocument: file, idDocumentUrl: response.url })
      } else if (type === 'photo') {
        setVerificationData({
          ...verificationData,
          workPhotos: [...verificationData.workPhotos, file],
          workPhotosUrls: [...verificationData.workPhotosUrls, response.url]
        })
      } else {
        setVerificationData({
          ...verificationData,
          workVideos: [...verificationData.workVideos, file],
          workVideosUrls: [...verificationData.workVideosUrls, response.url]
        })
      }
      setErrors({ ...errors, [type]: '' })
    } catch {
      setErrors({ ...errors, [type]: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  const handleAddReference = () => {
    setVerificationData({
      ...verificationData,
      references: [...verificationData.references, '']
    })
  }

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...verificationData.references]
    newReferences[index] = value
    setVerificationData({ ...verificationData, references: newReferences })
  }

  const handleRemoveReference = (index: number) => {
    const newReferences = verificationData.references.filter((_, i) => i !== index)
    setVerificationData({ ...verificationData, references: newReferences })
  }

  const validateStep = (step: VerificationStep): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (step === 'id' && !verificationData.idDocumentUrl) {
      newErrors.id = 'Please upload your ID document'
      setErrors(newErrors)
      return false
    }
    
    if (step === 'references') {
      const validReferences = verificationData.references.filter(ref => ref.trim().length > 0)
      if (validReferences.length < 2) {
        newErrors.references = 'Please provide at least 2 references'
        setErrors(newErrors)
        return false
      }
    }
    
    if (step === 'portfolio') {
      if (verificationData.workPhotosUrls.length < 3) {
        newErrors.portfolio = 'Please upload at least 3 work photos'
        setErrors(newErrors)
        return false
      }
    }
    
    setErrors(newErrors)
    return true
  }

  const handleNext = () => {
    if (!validateStep(currentStep)) return
    
    const currentIndex = steps.findIndex(s => s.key === currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key)
    }
  }

  const handleSubmit = async () => {
    // TODO: Submit verification data to backend
    // Submitting verification
    if (onComplete) {
      onComplete()
    }
  }

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Provider Verification
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Complete verification to build trust and get more bookings
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index < currentStepIndex
                      ? 'bg-primary text-white'
                      : index === currentStepIndex
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </div>
                <p className="text-xs text-center mt-2 text-gray-600 dark:text-gray-400">
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    index < currentStepIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6 min-h-[300px]">
        {currentStep === 'id' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Upload ID Document
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Upload a clear photo of your National ID, Driver's License, or Passport
              </p>
              {verificationData.idDocumentUrl ? (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ID Document Uploaded
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {verificationData.idDocument?.name}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setVerificationData({ ...verificationData, idDocument: null, idDocumentUrl: '' })}
                    >
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      Click to upload ID
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file, 'id')
                    }}
                    disabled={uploading}
                  />
                </label>
              )}
              {errors.id && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.id}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 'references' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Professional References
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Provide at least 2 professional references (name, phone, relationship)
              </p>
              {verificationData.references.map((ref, index) => (
                <div key={index} className="mb-3 flex gap-2">
                  <input
                    type="text"
                    value={ref}
                    onChange={(e) => handleReferenceChange(index, e.target.value)}
                    placeholder="Name, Phone, Relationship (e.g., John Doe, 0244123456, Former Client)"
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {verificationData.references.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveReference(index)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                onClick={handleAddReference}
                className="w-full"
              >
                + Add Reference
              </Button>
              {errors.references && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.references}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 'portfolio' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Work Portfolio
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Upload at least 3 photos of your completed work
              </p>
              
              {/* Photos */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {verificationData.workPhotosUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                    <img src={url} alt={`Work ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => {
                        const newPhotos = verificationData.workPhotos.filter((_, i) => i !== index)
                        const newUrls = verificationData.workPhotosUrls.filter((_, i) => i !== index)
                        setVerificationData({ ...verificationData, workPhotos: newPhotos, workPhotosUrls: newUrls })
                      }}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {verificationData.workPhotosUrls.length < 10 && (
                  <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <div className="text-center">
                      <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Add Photo</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload(file, 'photo')
                      }}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {errors.portfolio && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.portfolio}
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 'review' && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Review Your Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {verificationData.idDocumentUrl ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">ID Document</span>
                </div>
                <div className="flex items-center gap-2">
                  {verificationData.references.filter(r => r.trim()).length >= 2 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    References ({verificationData.references.filter(r => r.trim()).length})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {verificationData.workPhotosUrls.length >= 3 ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-gray-700 dark:text-gray-300">
                    Portfolio Photos ({verificationData.workPhotosUrls.length})
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your verification request will be reviewed within 24-48 hours. You'll receive a notification once approved.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        {currentStepIndex > 0 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="flex-1"
          disabled={uploading}
        >
          {currentStepIndex === steps.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

