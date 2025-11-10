import { Link } from 'react-router-dom'
import { Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Handighana</h3>
            <p className="text-sm">
              Trusted professionals across Ghana. Book instantly — no calls, no hassle.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Find Providers
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/become-provider" className="hover:text-primary transition-colors">
                  Become a Provider
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="tel:+233504910179" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  +233 50 491 0179
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@handyghana.com" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  info@handyghana.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Handighana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

