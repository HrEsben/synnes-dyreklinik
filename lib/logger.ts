type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

/**
 * Structured logger for consistent logging across the application
 * In production, this could be extended to send logs to a service like Sentry, LogRocket, etc.
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isServer = typeof window === 'undefined'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const env = this.isServer ? '[Server]' : '[Client]'
    return `${timestamp} ${env} [${level.toUpperCase()}] ${message}`
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const formattedMessage = this.formatMessage(level, message, context)

    // In production, you might want to send errors to an external service
    if (level === 'error' && !this.isDevelopment) {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(new Error(message), { extra: context })
    }

    // Only log debug messages in development
    if (level === 'debug' && !this.isDevelopment) {
      return
    }

    switch (level) {
      case 'debug':
        console.debug(formattedMessage, context ?? '')
        break
      case 'info':
        console.info(formattedMessage, context ?? '')
        break
      case 'warn':
        console.warn(formattedMessage, context ?? '')
        break
      case 'error':
        console.error(formattedMessage, context ?? '')
        break
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context)
  }

  /**
   * Log an API error with request context
   */
  apiError(endpoint: string, error: unknown, context?: LogContext): void {
    this.error(`API Error: ${endpoint}`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ...context,
    })
  }

  /**
   * Log a database error with context
   */
  dbError(operation: string, error: unknown, context?: LogContext): void {
    this.error(`Database Error: ${operation}`, {
      error: error instanceof Error ? error.message : String(error),
      ...context,
    })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for convenience
export default logger
