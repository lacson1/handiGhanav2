import { forwardRef, useState } from 'react'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { checkPasswordStrength } from '../../utils/formHelpers'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  hint?: string
  className?: string
  disabled?: boolean
  required?: boolean
  showStrength?: boolean
  placeholder?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({
    value,
    onChange,
    label,
    error,
    hint,
    className,
    disabled,
    required,
    showStrength = false,
    placeholder = "Enter your password"
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState(false)
    const strength = showStrength ? checkPasswordStrength(value) : null

    const getStrengthColor = (color: string) => {
      switch (color) {
        case 'red':
          return 'bg-red-500'
        case 'yellow':
          return 'bg-yellow-500'
        case 'blue':
          return 'bg-blue-500'
        case 'green':
          return 'bg-green-500'
        default:
          return 'bg-gray-300'
      }
    }

    const getStrengthLabel = (score: number) => {
      if (score >= 4) return 'Strong'
      if (score >= 3) return 'Good'
      if (score >= 2) return 'Fair'
      if (score >= 1) return 'Weak'
      return 'Very Weak'
    }

    return (
      <div className="relative">
        {label && (
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-3">
            {label}
            {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete="current-password"
            className={cn(
              "w-full pl-12 pr-14 py-4 rounded-xl border-2 transition-all text-base",
              "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-4",
              error
                ? "border-red-500 focus:ring-red-500/20"
                : "border-gray-300 dark:border-gray-600 focus:border-ghana-green focus:ring-ghana-green/20",
              disabled && "opacity-50 cursor-not-allowed",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              className
            )}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {showStrength && value && strength && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-2 space-y-2"
          >
            {/* Strength Bar */}
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    level <= strength.score
                      ? getStrengthColor(strength.color)
                      : "bg-gray-200 dark:bg-gray-700"
                  )}
                />
              ))}
            </div>

            {/* Strength Label */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Password strength:
              </span>
              <span className={cn(
                "font-medium",
                strength.color === 'green' && "text-green-600 dark:text-green-400",
                strength.color === 'blue' && "text-blue-600 dark:text-blue-400",
                strength.color === 'yellow' && "text-yellow-600 dark:text-yellow-400",
                strength.color === 'red' && "text-red-600 dark:text-red-400"
              )}>
                {getStrengthLabel(strength.score)}
              </span>
            </div>

            {/* Feedback */}
            {focused && strength.feedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pl-4 list-disc">
                  {strength.feedback.slice(0, 3).map((feedback, index) => (
                    <li key={index}>
                      {feedback}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        )}

        {hint && !error && !showStrength && (
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{hint}</p>
        )}

        {error && (
          <p className="text-base text-red-600 dark:text-red-400 mt-2 font-medium">{error}</p>
        )}
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

