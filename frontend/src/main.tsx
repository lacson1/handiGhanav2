import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initSentry } from './config/sentry'

// Initialize Sentry for error tracking
initSentry()

// Helper function to safely access sessionStorage
const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      return typeof window !== 'undefined' && window.sessionStorage ? sessionStorage.getItem(key) : null
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(key, value)
      }
    } catch {
      // Ignore sessionStorage errors (e.g., in privacy mode)
    }
  }
}

// Global error handler for unhandled promise rejections (e.g., failed dynamic imports)
if (typeof window !== 'undefined') {
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
      const lastReload = safeSessionStorage.getItem('lastChunkReload')
      const now = Date.now()
      if (!lastReload || (now - parseInt(lastReload)) > 5000) {
        safeSessionStorage.setItem('lastChunkReload', now.toString())
        // Reload the page to fetch fresh chunks
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        }, 1000)
      } else {
        console.error('Multiple reload attempts detected. Please clear your browser cache.')
      }
    }
  })
}

// Safely get root element and render app
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found! Make sure index.html has a <div id="root"></div>')
} else {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
