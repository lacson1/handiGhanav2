import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  useEffect(() => {
    try { setShowBanner(!localStorage.getItem('cookieConsent')) }
    catch { setShowBanner(true) }
  }, [])

  function chooseConsent(consent: 'accepted' | 'rejected') {
    try {
      localStorage.setItem('cookieConsent', consent)
      localStorage.setItem('cookieConsentDate', new Date().toISOString())
    } catch { /* The choice still dismisses the banner when storage is unavailable. */ }
    setShowBanner(false)
  }

  if (!showBanner) return null
  return (
    <section className="site-cookie" aria-label="Cookie preferences">
      <p>We use cookies to improve your experience. <Link to="/privacy">Privacy Policy</Link></p>
      <div><button onClick={() => chooseConsent('rejected')}>Reject</button><button onClick={() => chooseConsent('accepted')}>Accept</button></div>
    </section>
  )
}
