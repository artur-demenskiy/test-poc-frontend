import type { LogLevel, LogEntry } from '@/types'

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logLevel: LogLevel = 'info'

  setLogLevel(level: LogLevel): void {
    this.logLevel = level
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    }
    return levels[level] >= levels[this.logLevel]
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
    }
    
    if (context !== undefined) {
      entry.context = context
    }
    
    if (error !== undefined) {
      entry.error = error
    }
    
    return entry
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = entry.level.toUpperCase().padEnd(5)
    const message = entry.message
    const context = entry.context ? ` | ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? ` | Error: ${entry.error.message}` : ''

    return `[${timestamp}] ${level} | ${message}${context}${error}`
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, context)
      if (this.isDevelopment) {
        console.debug(this.formatMessage(entry))
      }
    }
  }

  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, context)
      console.info(this.formatMessage(entry))
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, context)
      console.warn(this.formatMessage(entry))
    }
  }

  error(message: string, context?: Record<string, unknown>, error?: Error): void {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, context, error)
      console.error(this.formatMessage(entry))
      
      // In production, you might want to send this to an error reporting service
      if (!this.isDevelopment && error) {
        // Example: Sentry.captureException(error)
        console.error('Error details:', error.stack)
      }
    }
  }

  // Group related logs
  group(label: string, fn: () => void): void {
    if (this.isDevelopment) {
      console.group(label)
      fn()
      console.groupEnd()
    } else {
      fn()
    }
  }

  // Time operations
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label)
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label)
    }
  }
}

export const logger = new Logger()
export default logger 