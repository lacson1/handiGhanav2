import { forwardRef, useState, useEffect } from 'react'
import { Phone } from 'lucide-react'
import { formatPhoneNumber, validatePhoneNumber, ghanaPhonePrefixes } from '../../utils/formHelpers'
import { cn } from '../../lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  hint?: string
  className?: string
  disabled?: boolean
  required?: boolean
  showValidation?: boolean
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({
    value,
    onChange,
    label,
    error,
    hint,
    className,
    disabled,
    required,
    showValidation = true
  }, ref) => {
    const [focused, setFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isValid, setIsValid] = useState(false)

    const formattedValue = formatPhoneNumber(value)

    useEffect(() => {
      if (value && showValidation) {
        setIsValid(validatePhoneNumber(value))
      }
    }, [value, showValidation])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value
      const numbersOnly = input.replace(/\D/g, '')
      
      // Limit to 10 digits for Ghana numbers
      if (numbersOnly.length <= 10) {
        onChange(numbersOnly)
      }
    }

    const handlePrefixSelect = (prefix: string) => {
      onChange(prefix)
      setShowSuggestions(false)
    }

    const filteredPrefixes = ghanaPhonePrefixes.filter(p =>
      value.length < 3 && p.value.startsWith(value)
    )

    return (
      <div className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          
          <input
            ref={ref}
            type="tel"
            value={formattedValue}
            onChange={handleChange}
            onFocus={() => {
              setFocused(true)
              if (value.length < 3) {
                setShowSuggestions(true)
              }
            }}
            onBlur={() => {
              setFocused(false)
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            placeholder="024 123 4567"
            disabled={disabled}
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors",
              "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-2",
              error
                ? "border-red-500 focus:ring-red-500/20"
                : isValid && value
                ? "border-ghana-green focus:ring-ghana-green/20"
                : "border-gray-200 dark:border-gray-600 focus:border-ghana-green focus:ring-ghana-green/20",
              disabled && "opacity-50 cursor-not-allowed",
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
        )}
        
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}

        {/* Network Prefix Suggestions */}
        <AnimatePresence>
          {showSuggestions && filteredPrefixes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Select Network Prefix
                </p>
              </div>
              {filteredPrefixes.map((prefix) => (
                <button
                  key={prefix.value}
                  type="button"
                  onClick={() => handlePrefixSelect(prefix.value)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {prefix.label}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded">
                    {prefix.network}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

PhoneInput.displayName = 'PhoneInput'

