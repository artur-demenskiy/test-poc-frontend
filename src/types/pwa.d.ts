/**
 * PWA Type Definitions
 * TypeScript interfaces and types for Progressive Web App functionality
 */

// Service Worker registration types
export interface ServiceWorkerRegistration {
  active: ServiceWorker | null
  installing: ServiceWorker | null
  waiting: ServiceWorker | null
  scope: string
  updateViaCache: RequestCache
  unregister(): Promise<boolean>
  update(): Promise<void>
}

// PWA manifest types
export interface PWAManifest {
  name: string
  short_name: string
  description: string
  theme_color: string
  background_color: string
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
  orientation: 'any' | 'natural' | 'landscape' | 'portrait' | 'portrait-primary' | 'portrait-secondary' | 'landscape-primary' | 'landscape-secondary'
  scope: string
  start_url: string
  icons: PWAIcon[]
  categories?: string[]
  lang?: string
  dir?: 'ltr' | 'rtl' | 'auto'
}

export interface PWAIcon {
  src: string
  sizes: string
  type: string
  purpose?: 'any' | 'maskable' | 'monochrome'
}

// Service Worker lifecycle events
export interface ServiceWorkerLifecycleEvent {
  target: ServiceWorker
  type: string
}

// PWA install prompt event
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

// Offline cache types
export interface OfflineCacheOptions {
  ttl?: number
  maxSize?: number
  version?: string
  strategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate'
}

export interface OfflineCacheItem<T = any> {
  data: T
  timestamp: number
  expiresAt?: number
  version?: string
  metadata?: Record<string, any>
}

// Network status types
export interface NetworkStatus {
  isOnline: boolean
  isOffline: boolean
  connectionType?: 'wifi' | 'cellular' | 'none'
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g'
}

// PWA update types
export interface PWAUpdateEvent {
  type: 'update-available' | 'update-installed' | 'update-failed'
  details?: any
}

// Service Worker message types
export interface ServiceWorkerMessage {
  type: string
  payload?: any
  id?: string
}

// Cache storage types
export interface CacheStorageOptions {
  cacheName: string
  maxAge?: number
  maxEntries?: number
  strategy?: 'cache-first' | 'network-first' | 'stale-while-revalidate'
}

// PWA installation types
export interface PWAInstallationOptions {
  promptEvent?: BeforeInstallPromptEvent
  deferredPrompt?: BeforeInstallPromptEvent
  userChoice?: 'accepted' | 'dismissed'
}

// Offline queue types
export interface OfflineQueueItem {
  id: string
  action: string
  payload: any
  timestamp: number
  retryCount: number
  maxRetries: number
}

// PWA metrics types
export interface PWAMetrics {
  installTime?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  cumulativeLayoutShift?: number
  offlineUsageTime?: number
  cacheHitRate?: number
}

// Service Worker error types
export interface ServiceWorkerError {
  message: string
  stack?: string
  type: string
  timestamp: number
  context?: any
}

// PWA configuration types
export interface PWAConfig {
  enabled: boolean
  registerType: 'autoUpdate' | 'prompt' | 'manual'
  workbox: any
  manifest: PWAManifest
  devOptions?: {
    enabled: boolean
    type: 'module' | 'classic'
  }
  includeAssets?: string[]
  includeManifestIcons?: boolean
  injectRegister?: 'auto' | 'inline' | 'script' | 'null'
  registerWebManifestInRoute?: boolean
  writeWebManifest?: boolean
  injectWebManifestIntoHtml?: boolean
  useCredentialsForManifestTag?: boolean
  strategies?: 'injectManifest' | 'generateSW'
  injectManifest?: {
    injectionPoint?: string
    additionalManifestEntries?: Record<string, any>
    rollupFormat?: 'iife' | 'es' | 'cjs'
  }
  generateSW?: {
    globPatterns?: string[]
    globIgnores?: string[]
    additionalManifestEntries?: Record<string, any>
    maximumFileSizeToCacheInBytes?: number
    modifyURLPrefix?: Record<string, string>
    dontCacheBustURLsMatching?: RegExp
    runtimeCaching?: any[]
    navigateFallback?: string
    navigateFallbackDenylist?: RegExp[]
    navigateFallbackAllowlist?: RegExp[]
    cleanupOutdatedCaches?: boolean
    sourcemap?: boolean
    inlineWorkboxRuntime?: boolean
    skipWaiting?: boolean
    clientsClaim?: boolean
    templatedURLs?: Record<string, string | string[]>
    manifestTransforms?: any[]
    additionalManifestEntries?: Record<string, any>
    maximumFileSizeToCacheInBytes?: number
    modifyURLPrefix?: Record<string, string>
    dontCacheBustURLsMatching?: RegExp
    runtimeCaching?: any[]
    navigateFallback?: string
    navigateFallbackDenylist?: RegExp[]
    navigateFallbackAllowlist?: RegExp[]
    cleanupOutdatedCaches?: boolean
    sourcemap?: boolean
    inlineWorkboxRuntime?: boolean
    skipWaiting?: boolean
    clientsClaim?: boolean
    templatedURLs?: Record<string, string | string[]>
    manifestTransforms?: any[]
  }
} 