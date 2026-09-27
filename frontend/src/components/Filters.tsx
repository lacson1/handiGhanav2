import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { FilterState, ServiceCategory, GhanaCity } from '../types'
import { SERVICE_CATEGORIES, GHANA_CITIES } from '../lib/utils'

interface FiltersProps {
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
}

export default function Filters({ filters, onFilterChange }: FiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const refinementCount = [filters.category, filters.verified, filters.availableNow, filters.minRating].filter(Boolean).length
  const active = Object.values(filters).some(Boolean)
  return (
    <section className="search-filters" aria-label="Provider filters">
      <div className="search-primary-fields">
        <div className="search-field search-query-field">
          <label htmlFor="provider-query">Service or professional</label>
          <div className="search-query-wrap"><Search size={19} aria-hidden="true" /><input id="provider-query" type="search" placeholder="What do you need help with?" value={filters.searchQuery || ''} onChange={e => onFilterChange({ ...filters, searchQuery: e.target.value || undefined })} /></div>
        </div>

        <div className="search-field"><label htmlFor="provider-location">Location</label><input id="provider-location" list="provider-cities" placeholder="City or area" value={filters.location || ''} onChange={e => onFilterChange({ ...filters, location: (e.target.value || undefined) as GhanaCity | undefined })} /><datalist id="provider-cities">{GHANA_CITIES.map(city => <option key={city} value={city} />)}</datalist></div>
      </div>
      <div className="search-filter-controls"><button className="search-filter-toggle" aria-expanded={expanded} aria-controls="search-extra-filters" onClick={() => setExpanded(!expanded)}><SlidersHorizontal size={16} aria-hidden="true" />More filters{refinementCount > 0 && <span className="search-filter-count">{refinementCount} active</span>}</button>{active && <button className="search-clear" onClick={() => onFilterChange({})}><X size={15} aria-hidden="true" />Clear filters</button>}</div>
      <div id="search-extra-filters" className="search-refinements" hidden={!expanded}>        <div className="search-field"><label htmlFor="provider-category">Category</label><select id="provider-category" value={filters.category || ''} onChange={e => onFilterChange({ ...filters, category: (e.target.value || undefined) as ServiceCategory | undefined })}><option value="">All categories</option>{SERVICE_CATEGORIES.map(category => <option key={category} value={category}>{category.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>)}</select></div>

        <label className="search-check"><input type="checkbox" checked={!!filters.verified} onChange={e => onFilterChange({ ...filters, verified: e.target.checked || undefined })} />Verified only</label>
        <label className="search-check"><input type="checkbox" checked={!!filters.availableNow} onChange={e => onFilterChange({ ...filters, availableNow: e.target.checked || undefined })} />Available now</label>
        <div className="search-rating"><label htmlFor="provider-rating">Rating</label><select id="provider-rating" value={filters.minRating || ''} onChange={e => onFilterChange({ ...filters, minRating: Number(e.target.value) || undefined })}><option value="">Any rating</option>{[4.5, 4, 3.5, 3].map(rating => <option key={rating} value={rating}>{rating.toFixed(1)} and above</option>)}</select></div>

      </div>
    </section>
  )
}
