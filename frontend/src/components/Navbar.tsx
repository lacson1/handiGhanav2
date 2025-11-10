import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { isAuthenticated, isProvider, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-ghana-red via-primary to-ghana-green flex items-center justify-center">
              <span className="text-black font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              HandyGhana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <a href="#providers" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              Find Providers
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
              How It Works
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4">
                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                {isProvider ? (
                  <Link to="/provider-dashboard">
                    <Button variant="outline" size="sm">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/my-bookings">
                    <Button variant="outline" size="sm">My Bookings</Button>
                  </Link>
                )}
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-black">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={() => setIsLoginModalOpen(true)}>
                  Sign In
                </Button>
                <Link to="/signup">
                  <Button variant="outline" size="sm">Sign Up</Button>
                </Link>
                <Link to="/become-provider">
                  <Button size="sm">Become a Provider</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-gray-200 dark:border-gray-800">
            <a 
              href="#providers" 
              className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Providers
            </a>
            <a 
              href="#how-it-works" 
              className="block px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            {isAuthenticated ? (
              <div className="px-4 space-y-2 pt-2">
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Admin</Button>
                  </Link>
                )}
                {isProvider ? (
                  <Link to="/provider-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Dashboard</Button>
                  </Link>
                ) : (
                  <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">My Bookings</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" className="w-full" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="px-4 space-y-2 pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => {
                  setIsLoginModalOpen(true)
                  setMobileMenuOpen(false)
                }}>
                  Sign In
                </Button>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">Sign Up</Button>
                </Link>
                <Link to="/become-provider" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">Become a Provider</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  )
}

