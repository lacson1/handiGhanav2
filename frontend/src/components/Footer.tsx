import { Link } from 'react-router-dom'
import { Phone, Mail, Facebook, Twitter, Instagram, Linkedin, MessageCircle, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-lg bg-linear-to-br from-ghana-red via-primary to-ghana-green flex items-center justify-center shadow-md">
                <span className="text-black font-bold text-xl">H</span>
              </div>
              <h3 className="text-xl font-bold text-white">Handighana</h3>
            </div>
            <p className="text-sm mb-4 leading-relaxed">
              Connect with trusted, verified service providers across Ghana. Book instantly — no calls, no hassle.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Serving all of Ghana</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition-colors flex items-center gap-2">
                  Find Providers
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-primary transition-colors flex items-center gap-2">
                  Browse Services
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors flex items-center gap-2">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/become-provider" className="hover:text-primary transition-colors flex items-center gap-2">
                  Become a Provider
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal & Support</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/help" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm mb-6">
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
              <li>
                <a 
                  href="https://wa.me/233504910179" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Support
                </a>
              </li>
            </ul>

            {/* Social Links */}
            <div>
              <p className="text-sm font-semibold text-white mb-3">Follow Us</p>
              <div className="flex gap-3">
                <a 
                  href="https://facebook.com/handighana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-primary hover:text-black rounded-lg transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com/handighana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-primary hover:text-black rounded-lg transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a 
                  href="https://instagram.com/handighana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-primary hover:text-black rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com/company/handighana" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-primary hover:text-black rounded-lg transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} Handighana. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <span className="text-gray-700">•</span>
              <Link to="/sitemap" className="hover:text-primary transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

