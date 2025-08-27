import React from 'react'
import { OfflineDemo } from '@/components/OfflineDemo'
import { PWAStatus } from '@/components/PWAStatus'

/**
 * Offline Page
 * Comprehensive demonstration of offline-first functionality and PWA features
 * Includes interactive demos, status monitoring, and technical information
 */
const Offline: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Offline-First & PWA Features
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of web applications with intelligent offline capabilities, 
            progressive web app features, and seamless user experience regardless of network conditions.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Progressive Web App
            </h3>
            <p className="text-gray-600">
              Installable app with native-like experience, standalone mode, and automatic updates.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Offline-First
            </h3>
            <p className="text-gray-600">
              Intelligent caching strategies with automatic fallbacks and seamless offline experience.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Performance
            </h3>
            <p className="text-gray-600">
              Optimized loading, smart caching, and instant navigation for better user experience.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Demo - Takes 2/3 of the space */}
          <div className="xl:col-span-2">
            <OfflineDemo />
          </div>
          
          {/* Sidebar - Takes 1/3 of the space */}
          <div className="space-y-8">
            <PWAStatus />
            
            {/* Quick Info Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                💡 How It Works
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">1.</span>
                  <span>Service worker caches app resources and API responses</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">2.</span>
                  <span>When offline, app uses cached data automatically</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">3.</span>
                  <span>Changes are queued and synced when back online</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-500 font-bold">4.</span>
                  <span>App updates automatically in the background</span>
                </div>
              </div>
            </div>

            {/* Browser Support */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🌐 Browser Support
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chrome/Edge:</span>
                  <span className="text-green-600 font-medium">✓ Full Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Firefox:</span>
                  <span className="text-green-600 font-medium">✓ Full Support</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Safari:</span>
                  <span className="text-yellow-600 font-medium">⚠️ Limited</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="text-green-600 font-medium">✓ Excellent</span>
                </div>
              </div>
            </div>

            {/* Development Tips */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                🛠️ Development
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Use Chrome DevTools Application tab to inspect service worker</p>
                <p>• Test offline mode in Network tab</p>
                <p>• Monitor cache storage and service worker lifecycle</p>
                <p>• Use Lighthouse for PWA audit</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            This is a demonstration of offline-first and PWA capabilities. 
            In production, customize caching strategies based on your app's needs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Offline 