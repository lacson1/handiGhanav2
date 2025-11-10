// Form validation and formatting helpers

// Phone number formatting for Ghana
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '')

  // Ghana phone numbers are typically 10 digits (0XXXXXXXXX)
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)} ${numbers.slice(3)}`
  } else if (numbers.length <= 10) {
    return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`
  }

  return `${numbers.slice(0, 3)} ${numbers.slice(3, 6)} ${numbers.slice(6, 10)}`
}

// Validate Ghana phone number
export const validatePhoneNumber = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '')
  // Ghana numbers start with 0 and have 10 digits
  // or international format +233 with 9 more digits
  return (
    (numbers.length === 10 && numbers.startsWith('0')) ||
    (numbers.length === 12 && numbers.startsWith('233'))
  )
}

// Common Ghana phone prefixes for suggestions
export const ghanaPhonePrefixes = [
  { value: '024', label: 'MTN - 024', network: 'MTN' },
  { value: '054', label: 'MTN - 054', network: 'MTN' },
  { value: '055', label: 'MTN - 055', network: 'MTN' },
  { value: '059', label: 'MTN - 059', network: 'MTN' },
  { value: '020', label: 'Vodafone - 020', network: 'Vodafone' },
  { value: '050', label: 'Vodafone - 050', network: 'Vodafone' },
  { value: '027', label: 'AirtelTigo - 027', network: 'AirtelTigo' },
  { value: '057', label: 'AirtelTigo - 057', network: 'AirtelTigo' },
  { value: '026', label: 'AirtelTigo - 026', network: 'AirtelTigo' },
  { value: '056', label: 'AirtelTigo - 056', network: 'AirtelTigo' },
]

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Suggest email domain based on partial input
export const suggestEmailDomain = (email: string): string[] => {
  const commonDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
    'aol.com'
  ]

  const atIndex = email.indexOf('@')
  if (atIndex === -1 || atIndex === email.length - 1) {
    return []
  }

  const domain = email.slice(atIndex + 1).toLowerCase()
  if (!domain) return commonDomains

  return commonDomains
    .filter(d => d.startsWith(domain))
    .map(d => email.slice(0, atIndex + 1) + d)
}

// Format card number with spaces
export const formatCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  const groups = numbers.match(/.{1,4}/g) || []
  return groups.join(' ').slice(0, 19) // Max 16 digits + 3 spaces
}

// Format expiry date MM/YY
export const formatExpiryDate = (value: string): string => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 2) {
    return numbers
  }
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
}

// Validate card expiry
export const validateExpiry = (expiry: string): boolean => {
  const [month, year] = expiry.split('/')
  if (!month || !year) return false

  const monthNum = parseInt(month, 10)
  const yearNum = parseInt(`20${year}`, 10)

  if (monthNum < 1 || monthNum > 12) return false

  const now = new Date()
  const expiryDate = new Date(yearNum, monthNum - 1)

  return expiryDate > now
}

// Format CVV (3-4 digits)
export const formatCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4)
}

// Password strength checker
export interface PasswordStrength {
  score: number // 0-4
  feedback: string[]
  color: string
}

export const checkPasswordStrength = (password: string): PasswordStrength => {
  let score = 0
  const feedback: string[] = []

  if (password.length === 0) {
    return { score: 0, feedback: ['Enter a password'], color: 'gray' }
  }

  // Length check
  if (password.length < 6) {
    feedback.push('Use at least 6 characters')
  } else if (password.length < 8) {
    score += 1
    feedback.push('Use at least 8 characters for better security')
  } else if (password.length >= 12) {
    score += 2
  } else {
    score += 1
  }

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Use both uppercase and lowercase letters')
  }

  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters (!@#$%...)')
  }

  // Common patterns check
  if (/^[0-9]+$/.test(password)) {
    score = Math.max(0, score - 2)
    feedback.push('Avoid using only numbers')
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    score = Math.max(0, score - 1)
    feedback.push('Mix letters with numbers and symbols')
  }

  // Determine color and label
  let color = 'gray'
  if (score >= 4) {
    color = 'green'
    if (feedback.length === 0) feedback.push('Strong password!')
  } else if (score >= 3) {
    color = 'blue'
    if (feedback.length === 0) feedback.push('Good password')
  } else if (score >= 2) {
    color = 'yellow'
  } else {
    color = 'red'
  }

  return { score, feedback, color }
}

// Format price/amount input
export const formatPrice = (value: string): string => {
  const numbers = value.replace(/[^\d.]/g, '')
  const parts = numbers.split('.')

  if (parts.length > 2) {
    return `${parts[0]}.${parts.slice(1).join('')}`
  }

  if (parts[1] && parts[1].length > 2) {
    return `${parts[0]}.${parts[1].slice(0, 2)}`
  }

  return numbers
}

// Validate Ghana cedis amount
export const validateAmount = (amount: string): boolean => {
  const num = parseFloat(amount)
  return !isNaN(num) && num > 0
}

// Name validation and formatting
export const formatName = (value: string): string => {
  return value
    .replace(/[^a-zA-Z\s'-]/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Debounce function for autocomplete
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Common service suggestions for search
export const serviceCategories = [
  'Electrician',
  'Plumber',
  'Cleaner',
  'Handyman',
  'Carpenter',
  'Painter',
  'Mechanic',
  'Gardener',
  'Tiler',
  'Welder',
  'EmergencyService',
  'NetworkSetup',
  'VeterinaryCare',
  'Pharmacy',
  'Other'
]

// Common service keywords for autocomplete
export const commonServiceKeywords = [
  'emergency',
  'repair',
  'installation',
  'maintenance',
  'replacement',
  'inspection',
  'cleaning',
  'painting',
  'wiring',
  'plumbing',
  'leak',
  'fix',
  'broken',
  'faulty',
  'new',
  'renovation'
]

// Category-specific icons
export const categoryIcons: Record<string, string> = {
  'Electrician': '⚡',
  'Plumber': '🔧',
  'Cleaner': '🧹',
  'Carpenter': '🪚',
  'Painter': '🎨',
  'Mechanic': '🔩',
  'Gardener': '🌱',
  'Handyman': '🛠️',
  'Tiler': '⬜',
  'Welder': '🔥',
  'AC Repair': '❄️',
  'Appliance Repair': '🔌',
  'Roofing': '🏠',
  'Masonry': '🧱',
  'Security Services': '🔒'
}

// Get icon for a service category
export const getCategoryIcon = (category: string): string => {
  return categoryIcons[category] || '🔧'
}

// Get service suggestions based on query
export const getServiceSuggestions = (query: string): string[] => {
  const lowerQuery = query.toLowerCase()

  const categorySuggestions = serviceCategories
    .filter(cat => cat.toLowerCase().includes(lowerQuery))

  const keywordSuggestions = commonServiceKeywords
    .filter(keyword => keyword.toLowerCase().includes(lowerQuery))
    .map(keyword => `${keyword} service`)

  return [...new Set([...categorySuggestions, ...keywordSuggestions])].slice(0, 8)
}

