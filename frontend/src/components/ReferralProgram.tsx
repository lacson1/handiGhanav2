import { useState, useEffect } from 'react'
import { Copy, Gift, CheckCircle, Share2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'

interface ReferralProgramProps {
  onClose?: () => void
}

export default function ReferralProgram({ onClose }: ReferralProgramProps) {
  const { user } = useAuth()
  const [referralCode, setReferralCode] = useState('')
  const [copied, setCopied] = useState(false)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalRewards: 0,
    pendingRewards: 0
  })

  useEffect(() => {
    // Generate or fetch referral code
    if (user) {
      // In production, fetch from API
      const code = user.id.substring(0, 8).toUpperCase() || 'HANDY2024'
      setReferralCode(code)
      
      // Fetch referral stats
      // TODO: Fetch from API
      setStats({
        totalReferrals: 5,
        totalRewards: 25.00,
        pendingRewards: 10.00
      })
    }
  }, [user])

  const handleCopy = () => {
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/signup?ref=${referralCode}`
    const shareText = `Join HandyGhana and get 10% off your first booking! Use my referral code: ${referralCode}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join HandyGhana',
          text: shareText,
          url: shareUrl
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Referral Program
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Earn rewards for every friend you refer
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="text-gray-500">✕</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Referrals</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Rewards</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">GHS {stats.totalRewards.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">GHS {stats.pendingRewards.toFixed(2)}</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="mb-6 p-4 bg-primary/5 border-2 border-primary/20 rounded-xl">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Your Referral Code
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <code className="text-lg font-mono font-bold text-primary">{referralCode}</code>
          </div>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="px-4"
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          How it works
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Share your referral code
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Send your code to friends via WhatsApp, SMS, or social media
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Friend signs up and books
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                They get 10% off their first booking when they use your code
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                You both earn rewards
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                You get GHS 5 when they complete their first booking
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Share buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleShare}
          className="flex-1"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share Referral Link
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex-1"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>

      {/* Terms */}
      <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        Rewards are credited after your referral completes their first paid booking. 
        Minimum payout: GHS 10. Terms apply.
      </p>
    </div>
  )
}

