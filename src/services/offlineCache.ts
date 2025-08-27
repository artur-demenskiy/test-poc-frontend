/**
 * Offline Cache Service for implementing offline-first data strategy
 * Provides intelligent caching with fallback mechanisms for offline scenarios
 */

export interface CacheItem<T = any> {
  data: T
  timestamp: number
  expiresAt?: number
  version?: string
}

export interface CacheOptions {
  ttl?: number // Time to live in milliseconds
  maxSize?: number // Maximum number of items in cache
  version?: string // Cache version for invalidation
}

/**
 * Offline-first cache service with intelligent fallback strategies
 */
export class OfflineCacheService {
  private cache: Map<string, CacheItem> = new Map()
  private readonly defaultTTL = 60 * 60 * 1000 // 1 hour default
  private readonly defaultMaxSize = 100 // Default cache size limit

  constructor(private options: CacheOptions = {}) {
    this.options = {
      ttl: this.defaultTTL,
      maxSize: this.defaultMaxSize,
      version: '1.0.0',
      ...options,
    }
  }

  /**
   * Store data in cache with optional TTL
   * @param key Cache key
   * @param data Data to cache
   * @param ttl Optional time to live override
   */
  public set<T>(key: string, data: T, ttl?: number): void {
    // Clean up expired items before adding new ones
    this.cleanup()

    // Check cache size limit
    if (this.cache.size >= (this.options.maxSize || this.defaultMaxSize)) {
      this.evictOldest()
    }

    const expiresAt = Date.now() + (ttl || this.options.ttl || this.defaultTTL)
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresAt,
      version: this.options.version || '1.0.0',
    })

    // Also store in localStorage for persistence across sessions
    try {
      localStorage.setItem(`offline_cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        expiresAt,
        version: this.options.version,
      }))
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error)
    }
  }

  /**
   * Retrieve data from cache with fallback to localStorage
   * @param key Cache key
   * @returns Cached data or null if not found/expired
   */
  public get<T>(key: string): T | null {
    // Try memory cache first
    let item = this.cache.get(key)
    
    if (!item) {
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem(`offline_cache_${key}`)
        if (stored) {
          item = JSON.parse(stored)
          // Restore to memory cache if item is valid
          if (item && item.data !== undefined) {
            this.cache.set(key, item)
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve cache from localStorage:', error)
      }
    }

    if (!item) {
      return null
    }

    // Check if item has expired
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.delete(key)
      return null
    }

    return item.data
  }

  /**
   * Check if a key exists in cache and is not expired
   * @param key Cache key
   * @returns boolean indicating if key exists and is valid
   */
  public has(key: string): boolean {
    return this.get(key) !== null
  }

  /**
   * Remove item from cache
   * @param key Cache key
   */
  public delete(key: string): void {
    this.cache.delete(key)
    try {
      localStorage.removeItem(`offline_cache_${key}`)
    } catch (error) {
      console.warn('Failed to remove cache from localStorage:', error)
    }
  }

  /**
   * Clear all cached items
   */
  public clear(): void {
    this.cache.clear()
    
    // Clear localStorage cache items
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('offline_cache_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error)
    }
  }

  /**
   * Get cache statistics
   * @returns Object with cache statistics
   */
  public getStats(): {
    size: number
    maxSize: number
    hitRate: number
    memoryUsage: number
  } {
    const memoryUsage = this.cache.size * 100 // Rough estimate in bytes
    
    return {
      size: this.cache.size,
      maxSize: this.options.maxSize || this.defaultMaxSize,
      hitRate: 0, // Would need to implement hit tracking
      memoryUsage,
    }
  }

  /**
   * Clean up expired cache items
   */
  private cleanup(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    this.cache.forEach((item, key) => {
      if (item.expiresAt && now > item.expiresAt) {
        expiredKeys.push(key)
      }
    })

    expiredKeys.forEach(key => this.delete(key))
  }

  /**
   * Evict oldest items when cache is full
   */
  private evictOldest(): void {
    let oldestKey: string | null = null
    let oldestTimestamp = Date.now()

    this.cache.forEach((item, key) => {
      if (item.timestamp < oldestTimestamp) {
        oldestTimestamp = item.timestamp
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  /**
   * Invalidate cache by version (useful for app updates)
   * @param version Version to invalidate
   */
  public invalidateByVersion(version: string): void {
    const keysToDelete: string[] = []

    this.cache.forEach((item, key) => {
      if (item.version !== version) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach(key => this.delete(key))
  }

  /**
   * Preload critical data for offline use
   * @param data Array of key-value pairs to preload
   */
  public preload<T>(data: Array<{ key: string; value: T; ttl?: number }>): void {
    data.forEach(({ key, value, ttl }) => {
      this.set(key, value, ttl)
    })
  }
}

// Export default instance with default options
export const offlineCache = new OfflineCacheService()

// Export utility functions
export const cacheData = <T>(key: string, data: T, ttl?: number) => 
  offlineCache.set(key, data, ttl)

export const getCachedData = <T>(key: string): T | null => 
  offlineCache.get(key)

export const isCached = (key: string): boolean => 
  offlineCache.has(key)

export const clearCache = () => offlineCache.clear() 