import { useState, useEffect, useCallback } from 'react'
import { pwaService, isOnline, onOffline, onOnline } from '@/services/pwa'
import { offlineCache, cacheData, getCachedData, isCached } from '@/services/offlineCache'

/**
 * React hook for offline-first functionality and PWA status
 * Provides real-time network status, offline data handling, and PWA capabilities
 */
export const useOffline = () => {
  const [isAppOnline, setIsAppOnline] = useState<boolean>(isOnline())
  const [isPWAReady, setIsPWAReady] = useState<boolean>(false)
  const [isInstallable, setIsInstallable] = useState<boolean>(false)
  const [isStandalone, setIsStandalone] = useState<boolean>(false)
  const [cacheStats, setCacheStats] = useState(offlineCache.getStats())

  // Update cache statistics
  const updateCacheStats = useCallback(() => {
    setCacheStats(offlineCache.getStats())
  }, [])

  // Cache data with automatic TTL
  const cacheDataWithTTL = useCallback(<T>(
    key: string, 
    data: T, 
    ttl?: number
  ): void => {
    cacheData(key, data, ttl)
    updateCacheStats()
  }, [updateCacheStats])

  // Get cached data with type safety
  const getCachedDataWithType = useCallback(<T>(key: string): T | null => {
    return getCachedData<T>(key)
  }, [])

  // Check if specific data is cached
  const isDataCached = useCallback((key: string): boolean => {
    return isCached(key)
  }, [])

  // Clear all cached data
  const clearAllCache = useCallback((): void => {
    offlineCache.clear()
    updateCacheStats()
  }, [updateCacheStats])

  // Force service worker update
  const updateServiceWorker = useCallback(async (reloadPage: boolean = false): Promise<void> => {
    await pwaService.updateServiceWorker(reloadPage)
  }, [])

  // Preload critical data for offline use
  const preloadData = useCallback(<T>(
    data: Array<{ key: string; value: T; ttl?: number }>
  ): void => {
    offlineCache.preload(data)
    updateCacheStats()
  }, [updateCacheStats])

  // Invalidate cache by version
  const invalidateCacheByVersion = useCallback((version: string): void => {
    offlineCache.invalidateByVersion(version)
    updateCacheStats()
  }, [updateCacheStats])

  useEffect(() => {
    // Set initial PWA status
    setIsPWAReady(true)
    setIsInstallable(pwaService.isInstallable())
    setIsStandalone(pwaService.isStandalone())

    // Setup network status listeners
    const handleOnline = () => {
      setIsAppOnline(true)
    }

    const handleOffline = () => {
      setIsAppOnline(false)
    }

    // Register callbacks
    onOnline(handleOnline)
    onOffline(handleOffline)

    // Cleanup
    return () => {
      // Note: In a real app, you might want to unregister these callbacks
      // For now, we'll keep them as they're global listeners
    }
  }, [])

  // Update cache stats periodically
  useEffect(() => {
    const interval = setInterval(updateCacheStats, 5000) // Update every 5 seconds
    return () => clearInterval(interval)
  }, [updateCacheStats])

  return {
    // Network status
    isOnline: isAppOnline,
    isOffline: !isAppOnline,
    
    // PWA status
    isPWAReady,
    isInstallable,
    isStandalone,
    
    // Cache operations
    cacheData: cacheDataWithTTL,
    getCachedData: getCachedDataWithType,
    isCached: isDataCached,
    clearCache: clearAllCache,
    cacheStats,
    
    // Service worker operations
    updateServiceWorker,
    
    // Advanced cache operations
    preloadData,
    invalidateCacheByVersion,
    
    // Utility functions
    updateCacheStats,
  }
}

/**
 * Specialized hook for offline-first data fetching
 * Automatically handles caching and offline fallbacks
 */
export const useOfflineData = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: {
    ttl?: number
    enabled?: boolean
    fallback?: T
  } = {}
) => {
  const { ttl, enabled = true, fallback } = options
  const { isOnline, cacheData, getCachedData, isCached } = useOffline()
  
  const [data, setData] = useState<T | null>(getCachedData<T>(key))
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [isFromCache, setIsFromCache] = useState<boolean>(isCached(key))

  const fetchData = useCallback(async (): Promise<void> => {
    if (!enabled) return

    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch fresh data if online
      if (isOnline) {
        const freshData = await fetchFn()
        setData(freshData)
        setIsFromCache(false)
        
        // Cache the fresh data
        cacheData(key, freshData, ttl)
      } else {
        // Offline: try to get from cache
        const cachedData = getCachedData<T>(key)
        if (cachedData) {
          setData(cachedData)
          setIsFromCache(true)
        } else if (fallback) {
          setData(fallback)
          setIsFromCache(true)
        } else {
          throw new Error('No cached data available and offline')
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      
      // Try fallback data if available
      if (fallback) {
        setData(fallback)
        setIsFromCache(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [key, fetchFn, enabled, isOnline, cacheData, getCachedData, ttl, fallback])

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Refresh data manually
  const refresh = useCallback(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    isFromCache,
    refresh,
    isCached: isCached(key),
  }
} 