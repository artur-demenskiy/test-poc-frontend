import React from 'react'
import { useOffline } from '@/hooks/useOffline'

/**
 * PWA Status Component
 * Displays real-time information about PWA status, network connectivity, and cache statistics
 * Provides user interface for managing offline functionality
 */
export const PWAStatus: React.FC = () => {
  const {
    isOnline,
    isOffline,
    isPWAReady,
    isInstallable,
    isStandalone,
    cacheStats,
    clearCache,
    updateServiceWorker,
    updateCacheStats,
  } = useOffline()

  // Handle cache clearing with confirmation
  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cached data? This will remove offline content.')) {
      clearCache()
    }
  }

  // Handle service worker update
  const handleUpdateServiceWorker = async () => {
    try {
      await updateServiceWorker(true) // Reload page after update
    } catch (error) {
      console.error('Failed to update service worker:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        PWA & Offline Status
      </h2>
      
      {/* Network Status */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Network Status</h3>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className={`font-medium ${
            isOnline ? 'text-green-700' : 'text-red-700'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        {isOffline && (
          <p className="text-sm text-amber-600 mt-2">
            ⚠️ You're currently offline. Some features may be limited.
          </p>
        )}
      </div>

      {/* PWA Status */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">PWA Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">PWA Ready:</span>
            <span className={`font-medium ${
              isPWAReady ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPWAReady ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Installable:</span>
            <span className={`font-medium ${
              isInstallable ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isInstallable ? '✓ Yes' : '✗ No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Standalone Mode:</span>
            <span className={`font-medium ${
              isStandalone ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isStandalone ? '✓ Yes' : '✗ No'}
            </span>
          </div>
        </div>
      </div>

      {/* Cache Statistics */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Cache Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Cached Items:</span>
            <span className="font-medium text-gray-800">
              {cacheStats.size} / {cacheStats.maxSize}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Memory Usage:</span>
            <span className="font-medium text-gray-800">
              ~{Math.round(cacheStats.memoryUsage / 1024)} KB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(cacheStats.size / cacheStats.maxSize) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-700">Actions</h3>
        
        <button
          onClick={updateCacheStats}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Refresh Cache Stats
        </button>
        
        <button
          onClick={handleUpdateServiceWorker}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Update App
        </button>
        
        <button
          onClick={handleClearCache}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
        >
          Clear All Cache
        </button>
      </div>

      {/* Offline Tips */}
      {isOffline && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h4 className="font-medium text-amber-800 mb-2">💡 Offline Tips</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Cached content is still available</li>
            <li>• New data will be synced when online</li>
            <li>• App works in standalone mode</li>
          </ul>
        </div>
      )}

      {/* PWA Installation Prompt */}
      {isInstallable && !isStandalone && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">📱 Install App</h4>
          <p className="text-sm text-blue-700 mb-3">
            Install this app on your device for a better experience and offline access.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors duration-200">
            Install App
          </button>
        </div>
      )}
    </div>
  )
}

export default PWAStatus 