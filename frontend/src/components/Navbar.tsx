import { 
  Menu, 
  X, 
  Search, 
  Info, 
  LayoutDashboard, 
  Calendar, 
  LogOut, 
  Shield, 
  Star, 
  User, 
  Settings,
  ChevronDown,
  UserCircle,
  LogIn
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from './ui/Button'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { isAuthenticated, isProvider, user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-ghana-red via-primary to-ghana-green flex items-center justify-center shadow-md">
              <span className="text-black font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              HandyGhana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="#providers" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Find Providers</span>
            </a>
            <a 
              href="#how-it-works" 
              className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors group"
            >
              <Info className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>How It Works</span>
            </a>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-4">
                {/* Admin Button */}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Button>
                  </Link>
                )}
                
                {/* Dashboard/Bookings Button */}
                {isProvider ? (
                  <Link to="/provider-dashboard">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/my-bookings">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Button>
                  </Link>
                )}
                
                {/* User Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-ghana-green flex items-center justify-center text-sm font-bold text-black shadow-md">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user?.email || ''}
                        </p>
                      </div>
                      
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <UserCircle className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link 
                        to="/settings" 
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowProfileDropdown(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      
                      <button
                        onClick={() => {
                          logout()
                          setShowProfileDropdown(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Link to="/signup">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
                <Link to="/become-provider">
                  <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-primary to-ghana-green hover:from-ghana-yellow hover:to-primary">
                    <Star className="h-4 w-4" />
                    <span>Become a Provider</span>
                  </Button>
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
              className="p-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-1 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
            <a 
              href="#providers" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search className="h-5 w-5" />
              <span>Find Providers</span>
            </a>
            <a 
              href="#how-it-works" 
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Info className="h-5 w-5" />
              <span>How It Works</span>
            </a>
            
            {isAuthenticated ? (
              <div className="px-2 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                {/* User Info */}
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-ghana-green flex items-center justify-center text-sm font-bold text-black">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                </div>

                {user?.role === 'ADMIN' && (
                  <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Admin Panel</span>
                    </Button>
                  </Link>
                )}
                {isProvider ? (
                  <Link to="/provider-dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>My Bookings</span>
                    </Button>
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    <span>My Profile</span>
                  </Button>
                </Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="px-2 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={() => {
                    setIsLoginModalOpen(true)
                    setMobileMenuOpen(false)
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Button>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Sign Up</span>
                  </Button>
                </Link>
                <Link to="/become-provider" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-ghana-green">
                    <Star className="h-4 w-4" />
                    <span>Become a Provider</span>
                  </Button>
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

