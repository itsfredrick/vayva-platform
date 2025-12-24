/**
 * Sentry Configuration for Error Logging
 * 
 * This file configures Sentry for error tracking and monitoring.
 * 
 * Setup Instructions:
 * 1. Install Sentry SDK: `pnpm add @sentry/nextjs`
 * 2. Set environment variables:
 *    - NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
 *    - SENTRY_AUTH_TOKEN=your_auth_token (for source maps)
 * 3. Import this file in your error boundary or _app.tsx
 * 
 * Usage:
 * ```typescript
 * import { logError, captureException } from '@/lib/sentry';
 * 
 * try {
 *   // your code
 * } catch (error) {
 *   logError(error, { context: 'additional info' });
 * }
 * ```
 */

// Placeholder for Sentry integration
// Uncomment and configure when ready to use Sentry

/*
import * as Sentry from '@sentry/nextjs';

export function initSentry() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 1.0,
            
            // Performance monitoring
            integrations: [
                new Sentry.BrowserTracing({
                    tracingOrigins: ['localhost', /^\//],
                }),
            ],
            
            // Filter out known errors
            beforeSend(event, hint) {
                // Don't send errors in development
                if (process.env.NODE_ENV === 'development') {
                    return null;
                }
                
                // Filter out specific errors
                const error = hint.originalException;
                if (error && typeof error === 'object' && 'message' in error) {
                    const message = error.message as string;
                    
                    // Ignore network errors
                    if (message.includes('NetworkError') || message.includes('Failed to fetch')) {
                        return null;
                    }
                }
                
                return event;
            },
        });
    }
}

export function logError(error: Error, context?: Record<string, any>) {
    console.error('Error:', error, context);
    
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.captureException(error, {
            extra: context,
        });
    }
}

export function captureException(error: Error, context?: Record<string, any>) {
    return logError(error, context);
}

export function setUserContext(user: { id: string; email: string; name?: string }) {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.setUser({
            id: user.id,
            email: user.email,
            username: user.name,
        });
    }
}

export function clearUserContext() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.setUser(null);
    }
}
*/

// Mock implementations for development
export function initSentry() {
    console.log('Sentry initialization (mock - install @sentry/nextjs to enable)');
}

export function logError(error: Error, context?: Record<string, any>) {
    console.error('Error logged:', error, context);
    // TODO: Send to Sentry when configured
}

export function captureException(error: Error, context?: Record<string, any>) {
    return logError(error, context);
}

export function setUserContext(user: { id: string; email: string; name?: string }) {
    console.log('User context set:', user);
    // TODO: Send to Sentry when configured
}

export function clearUserContext() {
    console.log('User context cleared');
    // TODO: Clear from Sentry when configured
}

// Export Sentry for direct use if needed
// export { Sentry };
