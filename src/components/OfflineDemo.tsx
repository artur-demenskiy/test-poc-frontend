import React, { useState } from 'react'
import { useOffline, useOfflineData } from '@/hooks/useOffline'

// Mock API function for demonstration
const mockApiCall = async (): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate random failure (30% chance)
  if (Math.random() < 0.3) {
    throw new Error('API call failed')
  }
  
  return `Data fetched at ${new Date().toLocaleTimeString()}`
}

/**
 * Offline Demo Component
 * Demonstrates offline-first functionality with data caching, offline fallbacks,
 * and real-time network status monitoring
 */
export const OfflineDemo: React.FC = () => {
  const [manualCacheKey, setManualCacheKey] = useState<string>('')
  const [manualCacheData, setManualCacheData] = useState<string>('')
  const [manualCacheTTL, setManualCacheTTL] = useState<number>(300000) // 5 minutes

  const {
    isOnline,
    isOffline,
    cacheData,
    getCachedData,
    isCached,
    cacheStats,
    preloadData,
  } = useOffline()

  // Example of offline-first data fetching
  const {
    data: autoFetchedData,
    isLoading: isAutoLoading,
    error: autoError,
    isFromCache: isAutoFromCache,
    refresh: refreshAutoData,
  } = useOfflineData('auto-fetch-demo', mockApiCall, {
    ttl: 60000, // 1 minute
    fallback: 'This is fallback data when offline and no cache available',
  })

  // Handle manual cache operations
  const handleManualCache = () => {
    if (manualCacheKey && manualCacheData) {
      cacheData(manualCacheKey, manualCacheData, manualCacheTTL)
      setManualCacheKey('')
      setManualCacheData('')
    }
  }

  const handlePreloadData = () => {
    const sampleData = [
      { key: 'preload-1', value: 'Preloaded data 1', ttl: 300000 },
      { key: 'preload-2', value: 'Preloaded data 2', ttl: 600000 },
      { key: 'preload-3', value: 'Preloaded data 3', ttl: 900000 },
    ]
    preloadData(sampleData)
  }

  const handleCheckCache = () => {
    if (manualCacheKey) {
      const cached = getCachedData<string>(manualCacheKey)
      if (cached) {
        alert(`Cached data: ${cached}`)
      } else {
        alert('No cached data found for this key')
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Offline-First Demo
        </h1>
        <p className="text-gray-600 text-lg">
          Experience the power of offline-first functionality with intelligent caching and fallbacks
        </p>
      </div>

      {/* Network Status Banner */}
      <div className={`p-4 rounded-lg border-2 ${
        isOnline 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center justify-center space-x-3">
          <div className={`w-4 h-4 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="font-semibold text-lg">
            {isOnline ? '🟢 Online - Full functionality available' : '🔴 Offline - Using cached data'}
          </span>
        </div>
      </div>

      {/* Auto-fetch Demo */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔄 Automatic Offline-First Data Fetching
        </h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshAutoData}
              disabled={isAutoLoading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              {isAutoLoading ? 'Fetching...' : 'Fetch Fresh Data'}
            </button>
            <span className="text-sm text-gray-600">
              {isAutoFromCache ? '📱 From Cache' : '🌐 From Network'}
            </span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="font-medium text-gray-700 mb-2">Current Data:</div>
            {autoError ? (
              <div className="text-red-600">❌ Error: {autoError.message}</div>
            ) : (
              <div className="text-gray-800">{autoFetchedData || 'No data yet'}</div>
            )}
          </div>
          
          <div className="text-sm text-gray-600">
            💡 This data automatically caches and falls back to cache when offline
          </div>
        </div>
      </div>

      {/* Manual Cache Management */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🗄️ Manual Cache Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cache Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Key
              </label>
              <input
                type="text"
                value={manualCacheKey}
                onChange={(e) => setManualCacheKey(e.target.value)}
                placeholder="Enter cache key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Data
              </label>
              <textarea
                value={manualCacheData}
                onChange={(e) => setManualCacheData(e.target.value)}
                placeholder="Enter data to cache"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                TTL (milliseconds)
              </label>
              <input
                type="number"
                value={manualCacheTTL}
                onChange={(e) => setManualCacheTTL(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleManualCache}
                disabled={!manualCacheKey || !manualCacheData}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cache Data
              </button>
              <button
                onClick={handleCheckCache}
                disabled={!manualCacheKey}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Check Cache
              </button>
            </div>
          </div>

          {/* Cache Status */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Cache Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-medium">{cacheStats.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Capacity:</span>
                  <span className="font-medium">{cacheStats.maxSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory Usage:</span>
                  <span className="font-medium">~{Math.round(cacheStats.memoryUsage / 1024)} KB</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={handlePreloadData}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Preload Sample Data
                </button>
                <button
                  onClick={() => {
                    if (manualCacheKey) {
                      const cached = isCached(manualCacheKey)
                      alert(`Key "${manualCacheKey}" is ${cached ? 'cached' : 'not cached'}`)
                    }
                  }}
                  disabled={!manualCacheKey}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Check Key Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offline Features */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          📱 Offline Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 mb-3">✅ Available Offline</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Cached data access</li>
              <li>• App navigation</li>
              <li>• UI interactions</li>
              <li>• Form inputs (saved locally)</li>
              <li>• Basic functionality</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-700 mb-3">⚠️ Limited Offline</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Real-time data updates</li>
              <li>• API calls</li>
              <li>• External resources</li>
              <li>• Live notifications</li>
            </ul>
          </div>
        </div>
        
        {isOffline && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h4 className="font-medium text-amber-800 mb-2">🔄 Sync When Online</h4>
            <p className="text-sm text-amber-700">
              Any changes made offline will automatically sync when you're back online.
            </p>
          </div>
        )}
      </div>

      {/* Technical Details */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          🔧 Technical Implementation
        </h2>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <strong>Service Worker:</strong> Handles caching strategies, offline fallbacks, and app updates
          </p>
          <p>
            <strong>Cache API:</strong> Stores data with TTL, automatic cleanup, and localStorage fallback
          </p>
          <p>
            <strong>Network Detection:</strong> Real-time monitoring of online/offline status
          </p>
          <p>
            <strong>Intelligent Fallbacks:</strong> Automatic fallback to cached data when offline
          </p>
          <p>
            <strong>PWA Features:</strong> Installable app, standalone mode, and offline-first architecture
          </p>
        </div>
      </div>
    </div>
  )
}

export default OfflineDemo 