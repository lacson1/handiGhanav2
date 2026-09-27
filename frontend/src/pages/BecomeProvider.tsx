import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SERVICE_CATEGORIES, GHANA_CITIES, formatCategory } from '../lib/utils'
import { providersApi, uploadApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { ServiceCategory, GhanaCity } from '../types'
import ProviderVerification from '../components/ProviderVerification'
import './BecomeProvider.css'

export default function BecomeProvider() {
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: user?.name || '', category: '', location: '', phone: '', description: '', areas: '', avatar: '', service: '', price: '', duration: '60' })
  useEffect(() => { if (user?.name) setForm(previous => previous.name ? previous : { ...previous, name: user.name }) }, [user?.name])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [providerId, setProviderId] = useState('')
  const [complete, setComplete] = useState(false)
  const field = (name: keyof typeof form, value: string) => setForm(previous => ({ ...previous, [name]: value }))
  async function upload(file?: File) {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { setError('Choose a JPG, PNG or WebP image smaller than 2 MB.'); return }
    setUploading(true); setError('')
    try { const result = await uploadApi.uploadImage(file, 'providers'); field('avatar', result.url) }
    catch { setError('Photo upload failed. Retry or continue without a photo.') }
    finally { setUploading(false) }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('')
    if (step < 2) { setStep(step + 1); return }
    setLoading(true)
    try {
      const result = await providersApi.create({ name: form.name.trim(), category: form.category as ServiceCategory, location: form.location as GhanaCity, description: form.description.trim(), phone: form.phone, whatsapp: form.phone, avatar: form.avatar || undefined, serviceAreas: form.areas.split(',').map(area => area.trim()).filter(Boolean), firstService: { name: form.service.trim(), basePrice: Number(form.price), duration: Number(form.duration) } })
      setProviderId(result.id)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create your profile. Please try again.') }
    finally { setLoading(false) }
  }
  if (!isAuthenticated) return <div className="onboarding-page"><section className="onboarding-panel"><h1>Become a Provider</h1><p>First, create an account and choose your password. After signing in, add your photo, services, prices and service areas.</p><Link className="onboarding-primary" to="/signup?redirect=%2Fbecome-provider">Create an account</Link><p>Already registered? <Link to="/signin?redirect=%2Fbecome-provider">Sign in to continue</Link></p></section></div>
  if (providerId) return <div className="onboarding-page"><section className="onboarding-panel"><h1>Your professional profile is created</h1><p>Your first service and price are saved. Next, submit verification and set working hours in your dashboard so customers can request a visit.</p>{!complete && <ProviderVerification providerId={providerId} onComplete={() => setComplete(true)} />}<Link className="onboarding-primary" to="/signin?redirect=%2Fprovider-dashboard">Sign in again to open your provider dashboard</Link></section></div>
  return <div className="onboarding-page"><section className="onboarding-panel"><Link to="/">← Back to home</Link><h1>Build your professional profile</h1><p>Help customers understand what you do, where you work and what a visit costs.</p><ol className="onboarding-progress" aria-label="Profile setup progress">{['Your profile', 'Services & prices', 'Preview'].map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined}>{index + 1}. {label}</li>)}</ol>
    <form onSubmit={submit}>{error && <p role="alert" className="onboarding-error">{error}</p>}
      {step === 0 && <><h2>Your profile</h2><div className="onboarding-photo">{form.avatar ? <img src={form.avatar} alt="Your professional profile preview" /> : <span aria-label="Photo placeholder">{(form.name || user?.name || 'You').slice(0, 1)}</span>}<label>Professional photo (optional)<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={event => { void upload(event.target.files?.[0]); event.target.value = '' }} /><small>{uploading ? 'Uploading photo…' : 'JPG, PNG or WebP · up to 2 MB'}</small></label></div>
      <label>Professional name<input required minLength={2} value={form.name} onChange={event => field('name', event.target.value)} /></label>
      <label>Category<select required value={form.category} onChange={event => field('category', event.target.value)}><option value="">Choose your main service</option>{SERVICE_CATEGORIES.map(category => <option key={category} value={category}>{formatCategory(category)}</option>)}</select></label>
      <label>Based in<select required value={form.location} onChange={event => field('location', event.target.value)}><option value="">Choose a city</option>{GHANA_CITIES.map(city => <option key={city}>{city}</option>)}</select></label>
      <label>Service areas<input value={form.areas} onChange={event => field('areas', event.target.value)} placeholder="East Legon, Tema" /><small>Separate neighbourhoods with commas.</small></label>
      <label>Phone / WhatsApp<input type="tel" required value={form.phone} onChange={event => field('phone', event.target.value)} placeholder="+233…" /></label>
      <label>About your work<textarea required minLength={10} rows={4} value={form.description} onChange={event => field('description', event.target.value)} placeholder="Describe your experience and the jobs you can help with." /></label></>}
      {step === 1 && <><h2>Add your first service</h2><p>You can add more services in your dashboard.</p><label>Service name<input required minLength={2} value={form.service} onChange={event => field('service', event.target.value)} placeholder="For example: leaking tap inspection" /></label><label>Price per visit (GH₵)<input type="number" required min="0.01" step="0.01" value={form.price} onChange={event => field('price', event.target.value)} /></label><label>Visit duration<select value={form.duration} onChange={event => field('duration', event.target.value)}>{[30, 60, 90, 120, 180, 240, 480].map(minutes => <option key={minutes} value={minutes}>{minutes} minutes</option>)}</select></label><p>Explain any materials or extra charges in your profile description.</p></>}
      {step === 2 && <><h2>Preview your profile</h2><article className="onboarding-preview">{form.avatar && <img src={form.avatar} alt={form.name} />}<h3>{form.name}</h3><p>{form.category} · {form.location}</p><p>{form.description}</p><p>Service areas: {form.areas || form.location}</p><p>{form.service} · <strong>GH₵{Number(form.price).toLocaleString('en-GH')}</strong> / visit · {form.duration} minutes</p><small>New profile · Verification pending · No reviews yet</small></article><p>After creation, complete verification and publish your working hours.</p></>}
      <div className="onboarding-actions">{step > 0 && <button type="button" disabled={loading} onClick={() => setStep(step - 1)}>Back</button>}<button className="onboarding-primary" disabled={loading || uploading} type="submit">{loading ? 'Creating profile…' : step === 2 ? 'Create professional profile' : 'Continue'}</button></div>
    </form></section></div>
}
