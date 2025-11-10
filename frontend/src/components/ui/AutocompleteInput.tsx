import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { useAutocomplete } from '../../hooks/useAutocomplete'
import type { AutocompleteOption } from '../../hooks/useAutocomplete'
import { cn } from '../../lib/utils'

interface AutocompleteInputProps {
  options: AutocompleteOption[]
  value: string
  onChange: (value: string) => void
  onSelect?: (option: AutocompleteOption) => void
  placeholder?: string
  icon?: React.ReactNode
  label?: string
  error?: string
  hint?: string
  className?: string
  disabled?: boolean
  required?: boolean
  minChars?: number
}

export const AutocompleteInput = forwardRef<HTMLInputElement, AutocompleteInputProps>(
  ({
    options,
    value,
    onChange,
    onSelect,
    placeholder,
    icon,
    label,
    error,
    hint,
    className,
    disabled,
    required,
    minChars = 1
  }, ref) => {
    const {
      inputValue,
      setInputValue,
      isOpen,
      filteredOptions,
      highlightedIndex,
      selectOption,
      handleKeyDown,
      containerRef,
      highlightedRef,
      isLoading
    } = useAutocomplete({
      options,
      value,
      onSelect: (option) => {
        onChange(option.value)
        onSelect?.(option)
      },
      minChars
    })

    return (
      <div ref={containerRef} className="relative">
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              onChange(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full pr-10 py-3 rounded-xl border transition-colors",
              "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
              "focus:outline-none focus:ring-2",
              icon ? "pl-10" : "pl-4",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-primary",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
          />
          
          {isLoading ? (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <ChevronDown
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          )}
        </div>

        {hint && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{hint}</p>
        )}
        
        {error && (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        )}

        <AnimatePresence>
          {isOpen && filteredOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
            >
              {filteredOptions.map((option, index) => (
                <button
                  key={`${option.value}-${index}`}
                  ref={highlightedIndex === index ? highlightedRef : null}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={cn(
                    "w-full px-4 py-3 text-left flex items-start gap-3 transition-colors",
                    "hover:bg-gray-50 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-600",
                    highlightedIndex === index && "bg-ghana-yellow/10 dark:bg-ghana-yellow/20 border-l-2 border-ghana-yellow",
                    index === 0 && "rounded-t-xl",
                    index === filteredOptions.length - 1 && "rounded-b-xl"
                  )}
                >
                  {option.icon && (
                    <span className="text-xl flex-shrink-0">{option.icon}</span>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {option.description}
                      </div>
                    )}
                  </div>
                  {inputValue === option.label && (
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

AutocompleteInput.displayName = 'AutocompleteInput'

