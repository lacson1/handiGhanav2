import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">HandyGhana</h3>
            <p className="text-sm">
              Trusted professionals across Ghana. Book instantly — no calls, no hassle.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-ghana-yellow transition-colors">
                  Find Providers
                </Link>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-ghana-yellow transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <Link to="/become-provider" className="hover:text-ghana-yellow transition-colors">
                  Become a Provider
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-ghana-yellow transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ghana-yellow transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-ghana-yellow transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} HandyGhana. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

