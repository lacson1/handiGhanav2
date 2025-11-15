import * as Sentry from '@sentry/react'

export const initSentry = () => {
  try {
    const dsn = import.meta.env.VITE_SENTRY_DSN

    if (dsn) {
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: import.meta.env.MODE === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      })

      // Sentry initialized successfully
    } else {
      if (import.meta.env.DEV) {
        console.warn('⚠️  Sentry DSN not configured')
      }
    }
  } catch (error) {
    // Don't let Sentry initialization crash the app
    console.error('Failed to initialize Sentry:', error)
  }
}

export default Sentry

