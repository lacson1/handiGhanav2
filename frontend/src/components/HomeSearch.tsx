import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ListFilter } from 'lucide-react'
import { GHANA_CITIES, SERVICE_CATEGORIES } from '../lib/utils'
import { statsApi } from '../lib/api'

export default function HomeSearch() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const filters = { query: query.trim() || undefined, category: category || undefined, location: location.trim() || undefined }
    const params = new URLSearchParams()
    if (filters.query) params.set('q', filters.query)
    if (filters.category) params.set('category', filters.category)
    if (filters.location) params.set('location', filters.location)
    // Navigation must never wait for optional analytics.
    void statsApi.trackSearch(filters).catch(() => {})
    navigate(`/search${params.size ? `?${params}` : ''}`)
  }

  return (
    <div className="home-search-area">
      <form className="home-search" role="search" aria-label="Find service providers" onSubmit={handleSubmit}>
        <div className="home-search-field">
          <label htmlFor="home-service">Service</label>
          <div className="home-input-wrap"><Search size={20} aria-hidden="true" /><input id="home-service" name="q" value={query} onChange={event => setQuery(event.target.value)} placeholder="What do you need?" type="search" /></div>
        </div>
        <div className="home-search-field">
          <label htmlFor="home-category">Category</label>
          <div className="home-input-wrap"><ListFilter size={20} aria-hidden="true" /><select id="home-category" name="category" value={category} onChange={event => setCategory(event.target.value)}><option value="">All categories</option>{SERVICE_CATEGORIES.map(item => <option key={item} value={item}>{item.replace(/([a-z])([A-Z])/g, '$1 $2')}</option>)}</select></div>
        </div>
        <div className="home-search-field">
          <label htmlFor="home-location">Location</label>
          <div className="home-input-wrap"><MapPin size={20} aria-hidden="true" /><input id="home-location" name="location" value={location} onChange={event => setLocation(event.target.value)} list="home-cities" placeholder="City or area" /></div>
          <datalist id="home-cities">{GHANA_CITIES.map(city => <option key={city} value={city} />)}</datalist>
        </div>
        <button className="home-search-submit" type="submit"><Search size={20} aria-hidden="true" />Search</button>
      </form>
      <div className="home-popular"><span>Popular:</span>{['Electrician', 'Plumber', 'Cleaner'].map(name => <Link key={name} to={`/search?category=${name}`}>{name}</Link>)}</div>
    </div>
  )
}
