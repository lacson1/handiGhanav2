import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ProviderProvider } from './context/ProviderContext'
import { ToastProvider } from './context/ToastContext'
import ToastContainer from './components/ui/Toast'
import { useToast } from './context/ToastContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppWidget from './components/WhatsAppWidget'
import CookieConsent from './components/CookieConsent'
import './index.css'

// Helper function to retry failed dynamic imports
const retryImport = (importFn: () => Promise<any>, retries = 2, delay = 1000): Promise<any> => {
  return new Promise((resolve, reject) => {
    const attempt = (remaining: number) => {
      importFn()
        .then(resolve)
        .catch((error) => {
          const isChunkError = 
            error?.message?.includes('Failed to fetch dynamically imported module') ||
            error?.message?.includes('Loading chunk') ||
            error?.name === 'ChunkLoadError'
          
          if (remaining > 0 && isChunkError) {
            console.warn(`Import failed, retrying... (${retries - remaining + 1}/${retries})`, error)
            setTimeout(() => attempt(remaining - 1), delay)
          } else if (isChunkError && remaining === 0) {
            console.error('Import failed after all retries, reloading page...', error)
            // Only reload if we haven't reloaded recently (prevent infinite loop)
            const lastReload = sessionStorage.getItem('lastChunkReload')
            const now = Date.now()
            if (!lastReload || (now - parseInt(lastReload)) > 5000) {
              sessionStorage.setItem('lastChunkReload', now.toString())
              window.location.reload()
            } else {
              reject(new Error('Failed to load module after multiple attempts. Please clear your browser cache.'))
            }
          } else {
            reject(error)
          }
        })
    }
    attempt(retries)
  })
}

// Lazy load pages for code splitting with retry logic
const Home = lazy(() => retryImport(() => import('./pages/Home')))
const SearchResults = lazy(() => retryImport(() => import('./pages/SearchResults')))
const ProviderProfile = lazy(() => retryImport(() => import('./pages/ProviderProfile')))
const SignIn = lazy(() => retryImport(() => import('./pages/SignIn')))
const SignUp = lazy(() => retryImport(() => import('./pages/SignUp')))
const OAuthCallback = lazy(() => retryImport(() => import('./pages/OAuthCallback')))
const ForgotPassword = lazy(() => retryImport(() => import('./pages/ForgotPassword')))
const ResetPassword = lazy(() => retryImport(() => import('./pages/ResetPassword')))
const BecomeProvider = lazy(() => retryImport(() => import('./pages/BecomeProvider')))
const Dashboard = lazy(() => retryImport(() => import('./pages/Dashboard')))
const ProviderDashboard = lazy(() => retryImport(() => import('./pages/ProviderDashboard')))
const AdminDashboard = lazy(() => retryImport(() => import('./pages/AdminDashboard')))
const CustomerDashboard = lazy(() => retryImport(() => import('./pages/CustomerDashboard')))
const Settings = lazy(() => retryImport(() => import('./pages/Settings')))
const PhotoUploadDemo = lazy(() => retryImport(() => import('./pages/PhotoUploadDemo')))
const FAQ = lazy(() => retryImport(() => import('./pages/FAQ')))
const Privacy = lazy(() => retryImport(() => import('./pages/Privacy')))
const Terms = lazy(() => retryImport(() => import('./pages/Terms')))
const Help = lazy(() => retryImport(() => import('./pages/Help')))

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

function AppContent() {
  const { toasts, removeToast } = useToast()
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/provider/:id" element={<ProviderProfile />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/become-provider" element={<BecomeProvider />} />
              <Route path="/photo-upload-demo" element={<PhotoUploadDemo />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/help" element={<Help />} />
              
              {/* Protected Routes - Require Authentication */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/my-bookings" element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              {/* Provider-Only Routes */}
              <Route path="/provider-dashboard" element={
                <ProtectedRoute requireProvider>
                  <ProviderDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin-Only Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppWidget />
        <CookieConsent />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </Router>
  )
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache persists (formerly cacheTime)
      refetchOnMount: false, // Don't refetch on component mount if data is fresh
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <ProviderProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </ProviderProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
