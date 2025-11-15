import { forwardRef, useState, useEffect } from 'react'
import { Mail } from 'lucide-react'
import { validateEmail, suggestEmailDomain } from '../../utils/formHelpers'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  hint?: string
  className?: string
  disabled?: boolean
  required?: boolean
  showValidation?: boolean
  showSuggestions?: boolean
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({
    value,
    onChange,
    label,
    error,
    hint,
    className,
    disabled,
    required,
    showValidation = true,
    showSuggestions = true
  }, ref) => {
    const [focused, setFocused] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
      if (value && showValidation) {
        setIsValid(validateEmail(value))
      }
    }, [value, showValidation])

    useEffect(() => {
      if (showSuggestions && value.includes('@') && !isValid) {
        const emailSuggestions = suggestEmailDomain(value)
        setSuggestions(emailSuggestions)
      } else {
        setSuggestions([])
      }
    }, [value, isValid, showSuggestions])

    const handleSuggestionClick = (suggestion: string) => {
      onChange(suggestion)
      setSuggestions([])
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
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />

          <input
            ref={ref}
            type="email"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              setTimeout(() => setSuggestions([]), 200)
            }}
            placeholder="your.email@example.com"
            disabled={disabled}
            autoComplete="email"
            className={cn(
              "w-full pl-12 pr-5 py-4 rounded-xl border-2 transition-all text-base",
              "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-4",
              error
                ? "border-red-500 focus:ring-red-500/20"
                : isValid && value
                  ? "border-ghana-green focus:ring-ghana-green/20"
                  : "border-gray-300 dark:border-gray-600 focus:border-ghana-green focus:ring-ghana-green/20",
              disabled && "opacity-50 cursor-not-allowed",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              className
            )}
          />

          {showValidation && value && !focused && (
            <div className={cn(
              "absolute right-3 top-1/2 transform -translate-y-1/2",
              isValid ? "text-green-500" : "text-red-500"
            )}>
              {isValid ? '✓' : '✗'}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-base text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{hint}</p>
        )}

        {error && (
          <p className="text-base text-red-600 dark:text-red-400 mt-2 font-medium">{error}</p>
        )}

        {/* Email Domain Suggestions */}
        <AnimatePresence>
          {focused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Did you mean?
                </p>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                >
                  {suggestion}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

EmailInput.displayName = 'EmailInput'

