import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <Link to="/" className="site-brand" aria-label="Handighana home"><span className="site-mark" aria-hidden="true">H</span><span>Handighana</span></Link>
        <nav aria-label="Footer navigation"><Link to="/search">Browse Services</Link><Link to="/help">Help Center</Link><Link to="/faq">FAQs</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></nav>
      </div>
      <div className="site-footer-bottom"><span>© {new Date().getFullYear()} Handighana</span><div><a href="mailto:info@handyghana.com">info@handyghana.com</a><a href="tel:+233504910179">+233 50 491 0179</a><a href="https://wa.me/233504910179" target="_blank" rel="noopener noreferrer">WhatsApp Support</a></div></div>
    </footer>
  )
}
