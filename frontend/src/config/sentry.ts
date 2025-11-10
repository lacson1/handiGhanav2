import * as Sentry from '@sentry/react'

export const initSentry = () => {
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

    console.log('✅ Sentry initialized for error tracking')
  } else {
    console.warn('⚠️  Sentry DSN not configured')
  }
}

export default Sentry

