import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
interface ProfileData {
  name: string
  email: string
  phone: string
  location: string
  bio: string
}

export default function Profile() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })
  const [originalData, setOriginalData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  })

  // Load profile data from localStorage or user context
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    const defaultData: ProfileData = {
      name: user?.name || '',
      email: user?.email || '',
      phone: localStorage.getItem('userPhone') || '',
      location: localStorage.getItem('userLocation') || '',
      bio: localStorage.getItem('userBio') || ''
    }

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfileData(parsed)
      setOriginalData(parsed)
    } else {
      setProfileData(defaultData)
      setOriginalData(defaultData)
    }
  }, [user])

  const handleSave = () => {
    // Save to localStorage (in a real app, this would be an API call)
    localStorage.setItem('userProfile', JSON.stringify(profileData))
    localStorage.setItem('userPhone', profileData.phone)
    localStorage.setItem('userLocation', profileData.location)
    localStorage.setItem('userBio', profileData.bio)
    
    // Update user in localStorage if name changed
    if (user && profileData.name !== user.name) {
      const updatedUser = { ...user, name: profileData.name }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      window.location.reload() // Refresh to update auth context
    }

    setOriginalData(profileData)
    setIsEditing(false)
    showToast('Profile updated successfully!', 'success')
  }

  const handleCancel = () => {
    setProfileData(originalData)
    setIsEditing(false)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
      case 'PROVIDER':
        return 'bg-primary/10 text-primary dark:bg-primary/20'
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getMemberSinceDate = () => {
    // Try to get from localStorage or use default
    const savedDate = localStorage.getItem('memberSince')
    if (savedDate) return savedDate
    
    const date = new Date()
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })
    localStorage.setItem('memberSince', formattedDate)
    return formattedDate
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your personal information
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit Profile</span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-ghana-red via-primary to-ghana-green"></div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 sm:-mt-12">
                {/* Avatar */}
                <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-primary to-ghana-green flex items-center justify-center text-4xl font-bold text-black shadow-lg border-4 border-white dark:border-gray-800">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center sm:text-left sm:ml-4 mt-4 sm:mt-0">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profileData.name || 'User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {profileData.email}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user?.role || 'CUSTOMER')}`}>
                      <Shield className="h-3 w-3" />
                      {user?.role || 'Customer'}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      <Calendar className="h-3 w-3" />
                      Member since {getMemberSinceDate()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Personal Information
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={true}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="+233 XX XXX XXXX"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="location"
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                    placeholder="City, Region"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  About
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tell others about yourself
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed resize-none"
                placeholder="Share a little about yourself..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {profileData.bio.length}/500 characters
              </p>
            </div>
          </motion.div>

          {/* Profile Photo Section - Only visible when editing */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Profile Photo
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Upload or remove your profile picture
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="inline-block p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="h-32 w-32 relative rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary to-ghana-green">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-5xl font-bold text-black">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Click the button below to upload or remove your photo
                    </p>
                    <div className="flex justify-center gap-2">
                      <input
                        id="profile-photo-input"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            // Simple client-side preview (in production, this would upload to server)
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              if (user) {
                                const updatedUser = { ...user, avatar: reader.result as string }
                                localStorage.setItem('user', JSON.stringify(updatedUser))
                                showToast('Profile photo updated! (Refresh to see changes)', 'success')
                              }
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-photo-input')?.click()}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Upload Photo
                      </Button>
                      {user?.avatar && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Remove profile photo?')) {
                              if (user) {
                                const updatedUser = { ...user, avatar: undefined }
                                localStorage.setItem('user', JSON.stringify(updatedUser))
                                showToast('Profile photo removed! (Refresh to see changes)', 'info')
                              }
                            }
                          }}
                          className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          {user?.role === 'PROVIDER' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Provider Actions
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Quick access to provider features
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate('/provider-dashboard')}
                  className="flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>View Dashboard</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/provider-dashboard?tab=services')}
                  className="flex items-center justify-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  <span>Manage Services</span>
                </Button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-end gap-4"
            >
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

