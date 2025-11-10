import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  icon?: string
}

interface UseAutocompleteProps {
  options: AutocompleteOption[]
  value: string
  onSelect: (option: AutocompleteOption) => void
  filterFunction?: (option: AutocompleteOption, query: string) => number
  minChars?: number
  maxResults?: number
  debounceMs?: number
}

// Smart fuzzy matching with scoring
function fuzzyScore(str: string, query: string): number {
  str = str.toLowerCase()
  query = query.toLowerCase()
  
  // Exact match gets highest score
  if (str === query) return 1000
  
  // Starts with query gets high score
  if (str.startsWith(query)) return 900
  
  // Contains whole query gets good score
  if (str.includes(query)) return 800
  
  // Fuzzy matching - calculate score based on character matches
  let score = 0
  let strIndex = 0
  
  for (let i = 0; i < query.length; i++) {
    const char = query[i]
    const foundIndex = str.indexOf(char, strIndex)
    
    if (foundIndex === -1) return 0 // No match
    
    // Closer matches get higher scores
    score += Math.max(0, 100 - (foundIndex - strIndex) * 5)
    strIndex = foundIndex + 1
  }
  
  return score
}

export function useAutocomplete({
  options,
  value,
  onSelect,
  filterFunction,
  minChars = 1,
  maxResults = 10,
  debounceMs = 150
}: UseAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [inputValue, setInputValue] = useState(value)
  const [debouncedValue, setDebouncedValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)
  const highlightedRef = useRef<HTMLButtonElement>(null)

  // Debounce input value for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs])

  // Default filter function with fuzzy scoring
  const defaultFilter = useCallback((option: AutocompleteOption, query: string): number => {
    const labelScore = fuzzyScore(option.label, query)
    const valueScore = fuzzyScore(option.value, query)
    const descScore = option.description ? fuzzyScore(option.description, query) * 0.5 : 0
    
    return Math.max(labelScore, valueScore, descScore)
  }, [])

  const filter = filterFunction || defaultFilter

  // Update filtered options with smart ranking
  const rankedOptions = useMemo(() => {
    if (debouncedValue.length < minChars) return []
    
    const scored = options
      .map(option => ({
        option,
        score: filter(option, debouncedValue)
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.option)
    
    return scored
  }, [debouncedValue, options, filter, minChars, maxResults])

  useEffect(() => {
    setFilteredOptions(rankedOptions)
    setIsOpen(rankedOptions.length > 0 && document.activeElement === containerRef.current?.querySelector('input'))
    setHighlightedIndex(-1)
  }, [rankedOptions])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectOption = useCallback((option: AutocompleteOption) => {
    setInputValue(option.label)
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSelect(option)
  }, [onSelect])

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedRef.current) {
      highlightedRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [highlightedIndex])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      // Open on arrow down when closed
      if (e.key === 'ArrowDown' && filteredOptions.length > 0) {
        e.preventDefault()
        setIsOpen(true)
        setHighlightedIndex(0)
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          selectOption(filteredOptions[highlightedIndex])
        } else if (filteredOptions.length > 0) {
          // Select first option if none highlighted
          selectOption(filteredOptions[0])
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
      case 'Tab':
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          e.preventDefault()
          selectOption(filteredOptions[highlightedIndex])
        } else {
          setIsOpen(false)
        }
        break
    }
  }, [isOpen, highlightedIndex, filteredOptions, selectOption])

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue)
  }, [])

  return {
    inputValue,
    setInputValue: handleInputChange,
    isOpen,
    setIsOpen,
    filteredOptions,
    highlightedIndex,
    selectOption,
    handleKeyDown,
    containerRef,
    highlightedRef,
    isLoading: inputValue !== debouncedValue
  }
}

