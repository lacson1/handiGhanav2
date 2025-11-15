import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initSentry } from './config/sentry'

// Initialize Sentry for error tracking
initSentry()

// Global error handler for unhandled promise rejections (e.g., failed dynamic imports)
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason
  const errorMessage = error?.message || String(error)
  
  // Handle dynamic import/chunk loading failures
  if (
    errorMessage?.includes('Failed to fetch dynamically imported module') ||
    errorMessage?.includes('Loading chunk') ||
    errorMessage?.includes('ChunkLoadError') ||
    error?.name === 'ChunkLoadError'
  ) {
    console.warn('Dynamic import failed, attempting to reload page...', error)
    event.preventDefault() // Prevent default error logging
    
    // Only reload if we haven't reloaded recently (prevent infinite loop)
    const lastReload = sessionStorage.getItem('lastChunkReload')
    const now = Date.now()
    if (!lastReload || (now - parseInt(lastReload)) > 5000) {
      sessionStorage.setItem('lastChunkReload', now.toString())
      // Reload the page to fetch fresh chunks
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      console.error('Multiple reload attempts detected. Please clear your browser cache.')
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
