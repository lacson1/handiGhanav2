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
  ArrowLeft
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'

export default function Settings() {
  const { user: _user } = useAuth()
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

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedEmail = localStorage.getItem('emailNotifications')
      const savedSms = localStorage.getItem('smsNotifications')
      const savedPush = localStorage.getItem('pushNotifications')
      const savedReminders = localStorage.getItem('bookingReminders')
      const savedPromotions = localStorage.getItem('promotions')
      const savedVisibility = localStorage.getItem('profileVisibility')
      const savedShowEmail = localStorage.getItem('showEmail')
      const savedShowPhone = localStorage.getItem('showPhone')

      if (savedEmail !== null) setEmailNotifications(savedEmail === 'true')
      if (savedSms !== null) setSmsNotifications(savedSms === 'true')
      if (savedPush !== null) setPushNotifications(savedPush === 'true')
      if (savedReminders !== null) setBookingReminders(savedReminders === 'true')
      if (savedPromotions !== null) setPromotions(savedPromotions === 'true')
      if (savedVisibility) setProfileVisibility(savedVisibility as 'public' | 'private')
      if (savedShowEmail !== null) setShowEmail(savedShowEmail === 'true')
      if (savedShowPhone !== null) setShowPhone(savedShowPhone === 'true')
    }

    loadSettings()
  }, [])

  const saveSettings = () => {
    localStorage.setItem('emailNotifications', emailNotifications.toString())
    localStorage.setItem('smsNotifications', smsNotifications.toString())
    localStorage.setItem('pushNotifications', pushNotifications.toString())
    localStorage.setItem('bookingReminders', bookingReminders.toString())
    localStorage.setItem('promotions', promotions.toString())
    localStorage.setItem('profileVisibility', profileVisibility)
    localStorage.setItem('showEmail', showEmail.toString())
    localStorage.setItem('showPhone', showPhone.toString())

    showToast('Settings saved successfully!', 'success')
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

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end gap-4"
          >
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              onClick={saveSettings}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

