import { logger } from './logger'

import type { ApiConfig, ApiResponse, AppError } from '@/types'

// Default API configuration
const defaultConfig: ApiConfig = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

class ApiClient {
  private config: ApiConfig

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout)

    try {
      logger.debug('API Request', { url, method: options.method || 'GET' })

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.config.headers,
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      logger.debug('API Response', { url, status: response.status, data })

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          logger.error('API Request timeout', { url, timeout: this.config.timeout })
          throw new Error('Request timeout')
        }
        
        logger.error('API Request failed', { url, error: error.message })
        throw error
      }
      
      throw new Error('Unknown error occurred')
    }
  }

  // GET request
  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'GET',
      ...options,
    })
  }

  // POST request
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : null
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
      ...options,
    })
  }

  // PUT request
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : null
    return this.request<T>(endpoint, {
      method: 'PUT',
      body,
      ...options,
    })
  }

  // PATCH request
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const body = data ? JSON.stringify(data) : null
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body,
      ...options,
    })
  }

  // DELETE request
  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      ...options,
    })
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.config.headers['Authorization'] = `Bearer ${token}`
  }

  // Remove authentication token
  removeAuthToken(): void {
    delete this.config.headers['Authorization']
  }

  // Update base URL
  setBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL
  }

  // Update timeout
  setTimeout(timeout: number): void {
    this.config.timeout = timeout
  }
}

// Create default API client instance
export const apiClient = new ApiClient()

// Export the class for custom instances
export { ApiClient }

// Utility function to handle API errors
export const handleApiError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return {
      code: 'API_ERROR',
      message: error.message,
      details: { stack: error.stack },
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred',
    details: { error },
  }
}

// Utility function to check if response is successful
export const isApiSuccess = <T>(
  response: ApiResponse<T>,
): response is ApiResponse<T> & { success: true } => {
  return response.success === true
} 