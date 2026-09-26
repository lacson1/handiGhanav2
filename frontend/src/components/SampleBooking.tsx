import { useEffect, useRef, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import type { Provider } from '../types'
import { sampleServices } from '../lib/sampleData'
import './SampleBooking.css'

export default function SampleBooking({ provider, onClose }: { provider: Provider; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const services = sampleServices.filter(service => service.providerId === provider.id)
  const [serviceId, setServiceId] = useState(services[0]?.id || '')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [step, setStep] = useState<'details' | 'review' | 'complete'>('details')
  const service = services.find(item => item.id === serviceId)!
  const today = new Date()
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => element.close()
  }, [])
  return <dialog ref={dialog} className="sample-dialog" aria-labelledby="sample-title" onCancel={onClose}>
    <header><span className="sample-label">SAMPLE ONLY · NO PAYMENT</span><button aria-label="Close sample booking" onClick={onClose}><X size={20} /></button></header>
    <h2 id="sample-title">{step === 'complete' ? 'Sample request complete' : step === 'review' ? 'Review your sample request' : 'Plan your sample visit'}</h2>
    <p className="sample-intro">{provider.name} · {provider.location}</p>
    {step === 'details' ? <form onSubmit={event => { event.preventDefault(); setStep('review') }}>
      <label htmlFor="sample-service">Service</label><select id="sample-service" value={serviceId} onChange={event => setServiceId(event.target.value)}>{services.map(item => <option key={item.id} value={item.id}>{item.name} — GHS {item.basePrice}</option>)}</select>
      <p className="sample-hint">{service.description} Approx. {service.duration} minutes. Prices are illustrative.</p>
      <div className="sample-fields"><div><label htmlFor="sample-date">Preferred date</label><input id="sample-date" type="date" required min={minimumDate} value={date} onChange={event => { setDate(event.target.value); setTime('') }} /></div><div><label htmlFor="sample-time">Example time slot</label><select id="sample-time" required value={time} onChange={event => setTime(event.target.value)}><option value="">Choose a time</option>{['09:00', '11:00', '14:00'].map(slot => <option key={slot}>{slot}</option>)}</select></div></div>
      <label htmlFor="sample-notes">Job notes (optional)</label><textarea id="sample-notes" rows={3} maxLength={500} placeholder="Example: The living-room socket needs checking." value={notes} onChange={event => setNotes(event.target.value)} />
      <p className="sample-hint">Use example details only. This practice request stays on this page and disappears when you close it.</p>
      <button className="search-action" type="submit">Review sample request</button>
    </form> : <>
      {step === 'complete' && <p className="sample-success" role="status"><CheckCircle2 size={22} />Practice complete. No provider was contacted and no booking was created.</p>}
      <dl className="sample-summary"><div><dt>Service</dt><dd>{service.name}</dd></div><div><dt>Preferred visit</dt><dd>{date} at {time}</dd></div><div><dt>Example price</dt><dd>GHS {service.basePrice}</dd></div>{notes && <div><dt>Job notes</dt><dd>{notes}</dd></div>}</dl>
      {step === 'review' ? <><p className="sample-hint">In a real booking, availability and price need confirmation. This button only simulates a request.</p><div className="sample-buttons"><button className="professional-profile" onClick={() => setStep('details')}>Edit details</button><button className="search-action" onClick={() => setStep('complete')}>Simulate booking request</button></div></> : <><p className="sample-hint">The next real-world step is provider confirmation. Payments, messages and provider responses are not simulated.</p><button className="search-action" onClick={onClose}>Back to sample professionals</button></>}
    </>}
  </dialog>
}
