import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Moon,
  Sun,
  Bell,
  Mail,
  Smartphone,
  Globe,
  Shield,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Lock,
  User,
  Key
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'
import { settingsApi, authApi } from '../lib/api'
import { Download, Trash2, AlertTriangle } from 'lucide-react'

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [bookingReminders, setBookingReminders] = useState(true)
  const [promotions, setPromotions] = useState(false)

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public')
  const [showEmail, setShowEmail] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  // Account Settings
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true)
        const settings = await settingsApi.getSettings()
        
        setEmailNotifications(settings.emailNotifications)
        setSmsNotifications(settings.smsNotifications)
        setPushNotifications(settings.pushNotifications)
        setBookingReminders(settings.bookingReminders)
        setPromotions(settings.promotions)
        setProfileVisibility(settings.profileVisibility as 'public' | 'private')
        setShowEmail(settings.showEmail)
        setShowPhone(settings.showPhone)
      } catch (error: unknown) {
        console.error('Failed to load settings:', error)
        showToast('Failed to load settings', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [showToast])

  const saveSettings = async () => {
    try {
      setIsSaving(true)
      await settingsApi.updateSettings({
        emailNotifications,
        smsNotifications,
        pushNotifications,
        bookingReminders,
        promotions,
        profileVisibility,
        showEmail,
        showPhone
      })

      showToast('Settings saved successfully!', 'success')
    } catch (error: unknown) {
      console.error('Failed to save settings:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings'
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields', 'error')
      return
    }

    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters long', 'error')
      return
    }

    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    try {
      setIsSaving(true)
      await settingsApi.changePassword(currentPassword, newPassword)
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      showToast('Password changed successfully!', 'success')
    } catch (error: unknown) {
      console.error('Failed to change password:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password'
      showToast(errorMessage, 'error')
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your account preferences and settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-primary" />
                ) : (
                  <Moon className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Appearance
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize how Handighana looks on your device
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Theme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {theme === 'light' ? 'Light mode active' : 'Dark mode active'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose how you want to be notified
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <label htmlFor="email-notifications" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Email Notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      SMS Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get text messages for important updates
                    </p>
                  </div>
                </div>
                <label htmlFor="sms-notifications" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="sms-notifications"
                    type="checkbox"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="sr-only peer"
                    aria-label="SMS Notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive browser notifications
                    </p>
                  </div>
                </div>
                <label htmlFor="push-notifications" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="push-notifications"
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Push Notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Booking Reminders
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Get reminders about upcoming bookings
                    </p>
                  </div>
                </div>
                <label htmlFor="booking-reminders" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="booking-reminders"
                    type="checkbox"
                    checked={bookingReminders}
                    onChange={(e) => setBookingReminders(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Booking Reminders"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Promotions & Updates
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive news and special offers
                    </p>
                  </div>
                </div>
                <label htmlFor="promotions" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="promotions"
                    type="checkbox"
                    checked={promotions}
                    onChange={(e) => setPromotions(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Promotions & Updates"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Privacy Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Privacy
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Control your privacy settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  {profileVisibility === 'public' ? (
                    <Eye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Profile Visibility
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {profileVisibility === 'public' ? 'Your profile is public' : 'Your profile is private'}
                    </p>
                  </div>
                </div>
                <select
                  id="profile-visibility"
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                  aria-label="Profile Visibility"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Show Email Address
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your email on your profile
                    </p>
                  </div>
                </div>
                <label htmlFor="show-email" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="show-email"
                    type="checkbox"
                    checked={showEmail}
                    onChange={(e) => setShowEmail(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Show Email Address"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Show Phone Number
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Display your phone on your profile
                    </p>
                  </div>
                </div>
                <label htmlFor="show-phone" className="relative inline-flex items-center cursor-pointer">
                  <input
                    id="show-phone"
                    type="checkbox"
                    checked={showPhone}
                    onChange={(e) => setShowPhone(e.target.checked)}
                    className="sr-only peer"
                    aria-label="Show Phone Number"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Account
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your account security
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Account Info */}
              <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</span>
                    <span className="text-sm text-gray-900 dark:text-white">{user?.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Account Type</span>
                    <span className="text-sm text-gray-900 dark:text-white capitalize">{user?.role?.toLowerCase() || 'Customer'}</span>
                  </div>
                  {user?.authProvider && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sign-in Method</span>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">{user.authProvider}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password */}
              {(!user || !user.authProvider || user.authProvider === 'local') && (
                <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Change Password
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Enter new password (min. 6 characters)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                      className="flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      {isSaving ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </div>
              )}

              {user && user.authProvider && user.authProvider !== 'local' && (
                <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This account uses social login. Password cannot be changed here.
                  </p>
                </div>
              )}

              {/* Data & Privacy Rights (Ghana Act 843 Compliance) */}
              <div className="space-y-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Data & Privacy Rights
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Under Ghana's Data Protection Act 843, you have the right to access, export, and delete your personal data.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Export My Data
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Download a copy of all your personal data in JSON format
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          setIsSaving(true)
                          const response = await authApi.exportData()
                          
                          // Download as JSON file
                          const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `my-data-export-${new Date().toISOString().split('T')[0]}.json`
                          document.body.appendChild(a)
                          a.click()
                          document.body.removeChild(a)
                          URL.revokeObjectURL(url)
                          
                          showToast('Data exported successfully!', 'success')
                        } catch (error: unknown) {
                          console.error('Export error:', error)
                          const errorMessage = error instanceof Error ? error.message : 'Failed to export data'
                          showToast(errorMessage, 'error')
                        } finally {
                          setIsSaving(false)
                        }
                      }}
                      disabled={isSaving}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-900 dark:text-red-200 mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Delete My Account
                      </h4>
                      <p className="text-xs text-red-700 dark:text-red-300">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        if (!confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.')) {
                          return
                        }
                        
                        const confirmation = prompt('Type "DELETE" to confirm account deletion:')
                        if (confirmation !== 'DELETE') {
                          showToast('Account deletion cancelled', 'info')
                          return
                        }

                        try {
                          setIsSaving(true)
                          await authApi.deleteAccount()
                          showToast('Account deleted successfully', 'success')
                          // Logout and redirect
                          logout()
                          navigate('/')
                        } catch (error: unknown) {
                          console.error('Delete error:', error)
                          const errorMessage = error instanceof Error ? error.message : 'Failed to delete account'
                          showToast(errorMessage, 'error')
                        } finally {
                          setIsSaving(false)
                        }
                      }}
                      disabled={isSaving}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end gap-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

