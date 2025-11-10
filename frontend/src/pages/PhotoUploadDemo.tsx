import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import PhotoUpload from '../components/PhotoUpload'

export default function PhotoUploadDemo() {
  const navigate = useNavigate()
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([])

  const handlePhotoUpload = (urls: string[]) => {
    setUploadedPhotos(urls)
    console.log('Uploaded photos:', urls)
  }

  const handleSubmit = () => {
    if (uploadedPhotos.length === 0) {
      alert('Please upload at least one photo')
      return
    }

    // Here you can do something with the uploaded photos
    console.log('Submitting photos:', uploadedPhotos)
    alert(`Successfully uploaded ${uploadedPhotos.length} photo(s)!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Photo Upload Demo
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload and manage your photos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Upload Your Photos
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add photos to showcase your work. You can upload up to 5 photos.
            </p>
          </div>

          {/* Photo Upload Component */}
          <PhotoUpload
            onUpload={handlePhotoUpload}
            maxPhotos={5}
            folder="demo"
            maxSizeMB={5}
            multiple={true}
            label="Work Photos"
            helperText="Upload high-quality photos to showcase your work"
          />

          {/* Submit Button */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={uploadedPhotos.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Submit
            </button>
          </div>

          {/* Debug Info */}
          {uploadedPhotos.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Uploaded Photo URLs:
              </h3>
              <div className="space-y-1">
                {uploadedPhotos.map((url, index) => (
                  <p key={index} className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                    {index + 1}. {url}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            How to Use PhotoUpload Component
          </h3>
          
          <div className="space-y-4 text-sm text-blue-800 dark:text-blue-200">
            <div>
              <h4 className="font-semibold mb-1">Basic Usage:</h4>
              <pre className="bg-white dark:bg-gray-800 p-3 rounded-lg overflow-x-auto text-xs">
{`<PhotoUpload
  onUpload={(urls) => console.log(urls)}
  maxPhotos={5}
  folder="my-folder"
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Props:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">onUpload</code> - Callback function that receives uploaded photo URLs</li>
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">maxPhotos</code> - Maximum number of photos (default: 5)</li>
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">folder</code> - Cloudinary folder name (default: 'uploads')</li>
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">maxSizeMB</code> - Maximum file size in MB (default: 5)</li>
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">multiple</code> - Allow multiple file selection (default: true)</li>
                <li><code className="bg-white dark:bg-gray-800 px-1 py-0.5 rounded">previewUrls</code> - Pre-populate with existing photo URLs</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Features:</h4>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Drag and drop support</li>
                <li>Image preview with remove option</li>
                <li>Upload progress indicator</li>
                <li>File type and size validation</li>
                <li>Error handling with user-friendly messages</li>
                <li>Dark mode support</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

