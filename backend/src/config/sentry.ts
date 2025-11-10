import * as Sentry from '@sentry/node'

export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Performance Monitoring
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app: undefined as any }),
      ],
    })

    console.log('✅ Sentry initialized for error tracking')
  } else {
    console.warn('⚠️  Sentry DSN not configured. Error tracking disabled.')
  }
}

export default Sentry

