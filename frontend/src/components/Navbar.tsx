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
  LogIn,
  Briefcase,
  Moon,
  Sun
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import Button from './ui/Button'
import LoginModal from './LoginModal'

export default function Navbar() {
  const { isAuthenticated, isProvider, user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showAuthDropdown, setShowAuthDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const authDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setShowAuthDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 shadow-sm" aria-label="Main navigation">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-1.5 sm:space-x-2 hover:opacity-80 transition-opacity shrink-0" aria-label="Handighana home">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-linear-to-br from-ghana-red via-primary to-ghana-green flex items-center justify-center shadow-md">
              <span className="text-black font-bold text-lg sm:text-xl">H</span>
            </div>
            <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
              Handighana
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate('/#providers')
                }
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors group whitespace-nowrap"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden xl:inline">Find Providers</span>
              <span className="xl:hidden">Providers</span>
            </button>
            <Link
              to="/search"
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors group whitespace-nowrap"
            >
              <Briefcase className="h-4 w-4 group-hover:scale-110 transition-transform shrink-0" />
              <span>Services</span>
            </Link>
            <button
              onClick={() => {
                if (window.location.pathname === '/') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate('/#how-it-works')
                }
              }}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors group whitespace-nowrap"
            >
              <Info className="h-4 w-4 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden xl:inline">How It Works</span>
              <span className="xl:hidden">How</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors shrink-0"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 ml-2 lg:ml-3">
                {/* User Name Display - Hidden on smaller screens */}
                <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <UserCircle className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[100px]">
                    {user?.name || 'User'}
                  </span>
                </div>

                {/* Admin Button */}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-2.5 py-1.5">
                      <Shield className="h-4 w-4 shrink-0" />
                      <span className="hidden 2xl:inline">Admin</span>
                    </Button>
                  </Link>
                )}

                {/* Dashboard/Bookings Button */}
                {isProvider ? (
                  <Link to="/provider-dashboard">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-2.5 py-1.5">
                      <LayoutDashboard className="h-4 w-4 shrink-0" />
                      <span className="hidden xl:inline">Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <Link to="/my-bookings">
                    <Button variant="outline" size="sm" className="flex items-center gap-1.5 px-2.5 py-1.5">
                      <Calendar className="h-4 w-4 shrink-0" />
                      <span className="hidden xl:inline">Bookings</span>
                    </Button>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative shrink-0" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-1.5 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-ghana-green flex items-center justify-center text-sm font-bold text-black shadow-md shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform shrink-0 ${showProfileDropdown ? 'rotate-180' : ''}`} />
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
              <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 ml-2 lg:ml-3">
                {/* Auth Dropdown */}
                <div className="relative shrink-0" ref={authDropdownRef}>
                  <button
                    onClick={() => setShowAuthDropdown(!showAuthDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-gray-700 dark:text-gray-300 shrink-0" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden xl:inline">Account</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform shrink-0 ${showAuthDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showAuthDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setIsLoginModalOpen(true)
                          setShowAuthDropdown(false)
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors w-full"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </button>

                      <Link
                        to="/signup"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setShowAuthDropdown(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>

                <Link to="/become-provider" className="shrink-0">
                  <Button size="sm" className="flex items-center gap-1.5 px-2.5 py-1.5 bg-linear-to-r from-primary to-ghana-green hover:from-ghana-yellow hover:to-primary whitespace-nowrap">
                    <Star className="h-4 w-4 shrink-0" />
                    <span className="hidden xl:inline">Become a Provider</span>
                    <span className="xl:hidden">Join</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Theme Toggle for mobile/tablet */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden py-4 space-y-1 border-t border-gray-200 dark:border-gray-800 animate-in slide-in-from-top duration-200">
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (window.location.pathname === '/') {
                  document.getElementById('providers')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate('/#providers')
                }
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
            >
              <Search className="h-5 w-5" />
              <span>Find Providers</span>
            </button>
            <Link
              to="/search"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Briefcase className="h-5 w-5" />
              <span>Services</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                if (window.location.pathname === '/') {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                } else {
                  navigate('/#how-it-works')
                }
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors w-full"
            >
              <Info className="h-5 w-5" />
              <span>How It Works</span>
            </button>

            {isAuthenticated ? (
              <div className="px-2 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                {/* User Name Display */}
                <div className="px-3 py-2.5 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20 flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name || 'User'}
                  </span>
                </div>

                {/* User Info */}
                <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-ghana-green flex items-center justify-center text-sm font-bold text-black">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
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
                  <Button size="sm" className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary to-ghana-green">
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

