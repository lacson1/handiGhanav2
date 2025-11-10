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
import './index.css'

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'))
const SearchResults = lazy(() => import('./pages/SearchResults'))
const ProviderProfile = lazy(() => import('./pages/ProviderProfile'))
const SignIn = lazy(() => import('./pages/SignIn'))
const SignUp = lazy(() => import('./pages/SignUp'))
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const BecomeProvider = lazy(() => import('./pages/BecomeProvider'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'))
const Settings = lazy(() => import('./pages/Settings'))
const PhotoUploadDemo = lazy(() => import('./pages/PhotoUploadDemo'))

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
