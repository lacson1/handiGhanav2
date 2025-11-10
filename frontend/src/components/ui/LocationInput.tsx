import { forwardRef } from 'react'
import { MapPin } from 'lucide-react'
import { getLocationSuggestions } from '../../data/ghanaLocations'
import type { LocationSuggestion } from '../../data/ghanaLocations'
import { AutocompleteInput } from './AutocompleteInput'
import type { AutocompleteOption } from '../../hooks/useAutocomplete'

interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  hint?: string
  className?: string
  disabled?: boolean
  required?: boolean
}

export const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(
  ({
    value,
    onChange,
    label = "Location",
    error,
    hint = "Start typing to see suggestions",
    className,
    disabled,
    required
  }, ref) => {
    // Convert location suggestions to autocomplete options
    const getOptions = (): AutocompleteOption[] => {
      const suggestions = getLocationSuggestions(value)
      return suggestions.map((suggestion: LocationSuggestion) => ({
        value: suggestion.name,
        label: suggestion.name,
        description: suggestion.region 
          ? `${suggestion.region} ${suggestion.type === 'neighborhood' ? '(Neighborhood)' : ''}`
          : `${suggestion.type === 'region' ? 'Region' : ''}`,
        icon: suggestion.popular ? '⭐' : undefined
      }))
    }

    return (
      <AutocompleteInput
        ref={ref}
        options={getOptions()}
        value={value}
        onChange={onChange}
        label={label}
        error={error}
        hint={hint}
        placeholder="e.g., Accra, Kumasi, East Legon..."
        icon={<MapPin className="h-5 w-5" />}
        className={className}
        disabled={disabled}
        required={required}
        minChars={0}
      />
    )
  }
)

LocationInput.displayName = 'LocationInput'

