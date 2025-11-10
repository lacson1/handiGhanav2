import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from "@sentry/profiling-node"

export const initSentry = () => {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development',
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      profilesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      integrations: [
        nodeProfilingIntegration(),
      ],
    })

    console.log('✅ Sentry initialized for error tracking')
  } else {
    console.warn('⚠️  Sentry DSN not configured. Error tracking disabled.')
  }
}

export default Sentry
