import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import './SiteShell.css'

export default function Navbar() {
  const { isAuthenticated, isProvider, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { pathname, hash } = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const profileButtonRef = useRef<HTMLButtonElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setMobileMenuOpen(false); setProfileOpen(false) }, [pathname, hash])
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (profileOpen) profileButtonRef.current?.focus()
        if (mobileMenuOpen) menuButtonRef.current?.focus()
        setProfileOpen(false)
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [profileOpen, mobileMenuOpen])

  const accountLinks = (
    <>
      {user?.role === 'ADMIN' && <Link to="/admin">Admin Panel</Link>}
      <Link to={isProvider ? '/provider-dashboard' : '/my-bookings'}>{isProvider ? 'Dashboard' : 'My Bookings'}</Link>
      <Link to="/profile">My Profile</Link>
      <Link to="/settings">Settings</Link>
      <button onClick={() => { logout(); setProfileOpen(false); setMobileMenuOpen(false) }}>Sign Out</button>
    </>
  )
  const openSignIn = () => { setMobileMenuOpen(false); navigate('/signin') }

  return (
    <>
      <a className="site-skip" href="#main-content">Skip to content</a>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <Link to="/" className="site-brand" aria-label="Handighana home"><span className="site-mark" aria-hidden="true">H</span><span>Handighana</span></Link>
          <div className="site-desktop-links">
            <Link to="/search">Find Providers</Link>
            <Link to="/#providers">Services</Link>
            <Link to="/#how-it-works">How It Works</Link>
          </div>
          <div className="site-nav-actions">
            <button className="site-icon-button" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            <div className="site-desktop-account">
              {isAuthenticated ? (
                <div className="site-profile" ref={profileRef}>
                  <button ref={profileButtonRef} className="site-account-button" aria-expanded={profileOpen} aria-controls="account-links" onClick={() => setProfileOpen(!profileOpen)}>{user?.name || 'Account'}<ChevronDown size={16} aria-hidden="true" /></button>
                  {profileOpen && <div id="account-links" className="site-account-links">{accountLinks}</div>}
                </div>
              ) : (
                <><button className="site-signin" onClick={openSignIn}>Sign In</button><Link className="site-join" to="/become-provider">Become a Provider</Link></>
              )}
            </div>
            <button ref={menuButtonRef} className="site-icon-button site-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-menu">{mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </nav>
        {mobileMenuOpen && <nav id="mobile-menu" className="site-mobile-menu" aria-label="Mobile navigation" onClick={event => { if ((event.target as HTMLElement).closest('a')) setMobileMenuOpen(false) }}>
          <Link to="/search">Find Providers</Link><Link to="/#providers">Services</Link><Link to="/#how-it-works">How It Works</Link>
          <div className="site-mobile-account">{isAuthenticated ? accountLinks : <><button onClick={openSignIn}>Sign In</button><Link to="/signup">Sign Up</Link><Link className="site-join" to="/become-provider">Become a Provider</Link></>}</div>
        </nav>}
      </header>
    </>
  )
}
