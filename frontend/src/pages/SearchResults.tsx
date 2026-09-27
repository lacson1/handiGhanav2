import { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Grid2x2, List, Search, RefreshCw, ArrowLeft, WifiOff } from 'lucide-react'
import Filters from '../components/Filters'
import ProviderCard from '../components/ProviderCard'
import BookingModal from '../components/BookingModal'
import ProviderDetailsDrawer from '../components/ProviderDetailsDrawer'
import type { Provider, FilterState } from '../types'
import { providersApi } from '../lib/api'
import { filterAndSortProviders, readSearchFilters, writeSearchFilters, SORT_OPTIONS } from '../lib/providerSearch'
import type { SortOption } from '../lib/providerSearch'
import './SearchResults.css'
import { sampleProviders, sampleServices } from '../lib/sampleData'
import SampleBooking from '../components/SampleBooking'

export default function SearchResults({ sample = false }: { sample?: boolean }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => readSearchFilters(searchParams), [searchParams])
  const sortParam = searchParams.get('sort') || 'relevance'
  const sortBy: SortOption = Object.hasOwn(SORT_OPTIONS, sortParam) ? sortParam as SortOption : 'relevance'
  const viewMode = searchParams.get('view') === 'list' ? 'list' : 'grid'
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null)
  const [drawerProvider, setDrawerProvider] = useState<Provider | null>(null)
  const [providers, setProviders] = useState<Provider[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (sample) { setProviders(sampleProviders); setStatus('success'); return }
    let cancelled = false
    setStatus('loading')
    providersApi.getAll().then(data => {
      if (!cancelled) { setProviders(Array.isArray(data) ? data : []); setStatus('success') }
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [attempt, sample])

  const bookingId = searchParams.get('book')
  useEffect(() => {
    if (!sample && bookingId && status === 'success') {
      const provider = providers.find(item => item.id === bookingId)
      if (provider) setSelectedProvider(provider)
      else { let cancelled = false; providersApi.getById(bookingId).then(item => { if (!cancelled) setSelectedProvider(item) }).catch(() => {}); return () => { cancelled = true } }
    }
  }, [bookingId, status, providers, sample])

  const results = useMemo(() => filterAndSortProviders(providers, filters, sortBy), [providers, filters, sortBy])
  const activeFilters = Object.values(filters).some(Boolean)
  const changeFilters = (next: FilterState) => setSearchParams(writeSearchFilters(next, searchParams), { replace: true })
  const changePreference = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set(key, value)
    setSearchParams(params, { replace: true })
  }

  return (
    <div className="search-page">
      <div className="search-container">
        <Link to="/" className="search-back"><ArrowLeft size={16} aria-hidden="true" />Back to home</Link>
        <div className="search-heading"><h1>Find your next helping hand.</h1><p>Explore local professionals and find the right fit for your job.</p></div>
        {sample ? <aside className="sample-banner"><div><strong>Explore a sample booking</strong><p>Fictional profiles and prices. Nothing is sent or charged.</p></div><Link to="/search">Exit sample mode</Link></aside> : <Link className="sample-entry" to="/demo">New here? Try the sample booking flow →</Link>}
        <Filters filters={filters} onFilterChange={changeFilters} />
        <div className="search-results-toolbar">
          <p role="status" aria-live="polite">{status === 'loading' ? 'Finding professionals…' : status === 'error' ? 'Providers unavailable' : <><strong>{results.length}</strong> {results.length === 1 ? 'professional' : 'professionals'} found</>}</p>
          <div className="search-results-options">
            <label className="search-sort" htmlFor="sort-select">Sort by<select id="sort-select" value={sortBy} onChange={e => changePreference('sort', e.target.value)}>{Object.entries(SORT_OPTIONS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
            <div className="search-view-toggle" role="group" aria-label="Results layout">
              <button aria-label="Grid view" aria-pressed={viewMode === 'grid'} onClick={() => changePreference('view', 'grid')}><Grid2x2 size={18} /></button>
              <button aria-label="List view" aria-pressed={viewMode === 'list'} onClick={() => changePreference('view', 'list')}><List size={18} /></button>
            </div>
          </div>
        </div>
        {status === 'loading' ? <div className="search-loading" aria-label="Loading providers">{[0, 1, 2].map(index => <div key={index} className="search-skeleton" aria-hidden="true"><span /><span /><span /></div>)}</div>
          : status === 'error' ? <section className="search-empty" role="alert"><WifiOff size={32} aria-hidden="true" /><h2>We couldn’t load professionals</h2><p>Please try again in a moment. Your filters are saved.</p><button className="search-action" onClick={() => setAttempt(value => value + 1)}><RefreshCw size={17} aria-hidden="true" />Try again</button></section>
          : results.length === 0 ? <section className="search-empty"><Search size={32} aria-hidden="true" /><h2>{activeFilters ? 'No matches just yet' : 'No professionals listed yet'}</h2><p>{activeFilters ? 'Try a different service or location, or clear your filters to explore all professionals.' : 'Please check back soon as more professionals join Handighana.'}</p>{activeFilters && <button className="search-action" onClick={() => changeFilters({})}>Clear filters</button>}</section>
          : <div className={`search-provider-results search-provider-results--${viewMode}`}>{results.map(provider => <ProviderCard key={provider.id} provider={provider} sample={sample} startingPrice={sample ? Math.min(...sampleServices.filter(service => service.providerId === provider.id && service.isActive).map(service => service.basePrice)) : undefined} onBook={setSelectedProvider} onViewProfile={setDrawerProvider} />)}</div>}
      </div>
      {sample ? selectedProvider && <SampleBooking key={selectedProvider.id} provider={selectedProvider} onClose={() => setSelectedProvider(null)} /> : <BookingModal provider={selectedProvider} isOpen={!!selectedProvider} onClose={() => setSelectedProvider(null)} onConfirm={() => setSelectedProvider(null)} />}
      <ProviderDetailsDrawer servicesOverride={sample ? sampleServices : undefined} provider={drawerProvider} isOpen={!!drawerProvider} onClose={() => setDrawerProvider(null)} onBook={provider => { setDrawerProvider(null); setSelectedProvider(provider) }} />
    </div>
  )
}
