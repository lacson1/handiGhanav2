import { Star, MapPin, BadgeCheck, Clock, Phone, MessageCircle, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import type { Provider } from '../types'
import QuoteRequestModal from './QuoteRequestModal'
import { formatAvailability, isAvailableNow } from '../lib/utils'

interface ProviderCardProps {
  provider: Provider
  onBook: (provider: Provider) => void
  onViewProfile: (provider: Provider) => void
}

export default function ProviderCard({ provider, onBook, onViewProfile }: ProviderCardProps) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [failedAvatar, setFailedAvatar] = useState<string | undefined>()
  const initials = provider.name.split(/\s+/).filter(Boolean).slice(0, 2).map(name => name[0]).join('')

  return (
    <article className="professional-card" aria-label={provider.name}>
      <div className="professional-main">
        <div className="professional-header">
          <div className="professional-avatar" aria-hidden="true">{provider.avatar && failedAvatar !== provider.avatar ? <img src={provider.avatar} alt="" loading="lazy" onError={() => setFailedAvatar(provider.avatar)} /> : initials}</div>
          <div><p className="professional-category">{provider.category.replace(/([a-z])([A-Z])/g, '$1 $2')}</p><h2><button onClick={() => onViewProfile(provider)}>{provider.name}</button></h2></div>
        </div>
        <div className="professional-meta"><span><MapPin size={15} aria-hidden="true" />{provider.location}</span>{provider.verified && <span className="professional-verified"><BadgeCheck size={16} aria-hidden="true" />Verified</span>}</div>
        <p className="professional-description">{provider.description}</p>
        <div className="professional-proof">{provider.reviewCount > 0 ? <span><Star size={16} aria-hidden="true" /><strong>{provider.rating.toFixed(1)}</strong><span>({provider.reviewCount} {provider.reviewCount === 1 ? 'review' : 'reviews'})</span></span> : <span>No reviews yet</span>}<span className={isAvailableNow(provider.availability) ? 'professional-available' : ''}><Clock size={15} aria-hidden="true" />{formatAvailability(provider.availability)}</span></div>
      </div>
      <div className="professional-actions">
        <button className="search-action" onClick={() => onBook(provider)}>Book now</button>
        <button className="professional-profile" onClick={() => onViewProfile(provider)}>View profile<ArrowUpRight size={16} aria-hidden="true" /></button>
        <div className="professional-contact"><button onClick={() => setIsQuoteModalOpen(true)} aria-label={`Request a quote from ${provider.name}`}>Request a quote</button>{provider.whatsapp && <a href={`https://wa.me/${provider.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${provider.name} on WhatsApp`}><MessageCircle size={17} /></a>}{provider.phone && <a href={`tel:${provider.phone}`} aria-label={`Call ${provider.name}`}><Phone size={17} /></a>}</div>
      </div>
      <QuoteRequestModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} providerId={provider.id} providerName={provider.name} category={provider.category} />
    </article>
  )
}
