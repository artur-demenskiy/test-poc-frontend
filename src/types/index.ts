// Common types for the application
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

// Form types
export interface FormField {
  value: string
  error?: string
  touched: boolean
}

export interface FormState {
  [key: string]: FormField
}

// Navigation types
export interface NavigationItem {
  label: string
  path: string
  icon?: string
  children?: NavigationItem[]
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// API types
export interface ApiConfig {
  baseURL: string
  timeout: number
  headers: Record<string, string>
}

// Logger types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, unknown>
  error?: Error
} 