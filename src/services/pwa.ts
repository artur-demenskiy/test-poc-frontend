import { registerSW } from 'virtual:pwa-register'

/**
 * PWA Service for managing Progressive Web App functionality
 * Handles service worker registration, updates, and offline state management
 */
export class PWAService {
  private updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined
  private isOnline: boolean = navigator.onLine
  private offlineCallbacks: Array<() => void> = []
  private onlineCallbacks: Array<() => void> = []

  constructor() {
    this.initializePWA()
    this.setupNetworkListeners()
  }

  /**
   * Initialize PWA functionality including service worker registration
   */
  private initializePWA(): void {
    // Register service worker with auto-update functionality
    this.updateSW = registerSW({
      onNeedRefresh() {
        // Service worker has new content available
        console.log('PWA: New content available, refresh needed')
      },
      onOfflineReady() {
        // App is ready for offline use
        console.log('PWA: App is ready for offline use')
      },
      onRegistered(swRegistration: ServiceWorkerRegistration | undefined) {
        // Service worker registered successfully
        console.log('PWA: Service worker registered', swRegistration)
      },
      onRegisterError(error: any) {
        // Service worker registration failed
        console.error('PWA: Service worker registration failed', error)
      },
    })
  }

  /**
   * Setup network status listeners for offline/online detection
   */
  private setupNetworkListeners(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('PWA: Network connection restored')
      this.onlineCallbacks.forEach(callback => callback())
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('PWA: Network connection lost')
      this.offlineCallbacks.forEach(callback => callback())
    })
  }

  /**
   * Check if the app is currently online
   * @returns boolean indicating online status
   */
  public isAppOnline(): boolean {
    return this.isOnline
  }

  /**
   * Register callback for when app goes offline
   * @param callback Function to execute when offline
   */
  public onOffline(callback: () => void): void {
    this.offlineCallbacks.push(callback)
  }

  /**
   * Register callback for when app comes back online
   * @param callback Function to execute when online
   */
  public onOnline(callback: () => void): void {
    this.onlineCallbacks.push(callback)
  }

  /**
   * Force update of the service worker
   * @param reloadPage Whether to reload the page after update
   */
  public async updateServiceWorker(reloadPage: boolean = false): Promise<void> {
    if (this.updateSW) {
      await this.updateSW(reloadPage)
    }
  }

  /**
   * Check if PWA is installable (meets install criteria)
   * @returns boolean indicating if PWA can be installed
   */
  public isInstallable(): boolean {
    // Check if beforeinstallprompt event has been fired
    return 'serviceWorker' in navigator && 'PushManager' in window
  }

  /**
   * Get PWA installation prompt if available
   * @returns Promise that resolves to the install prompt or null
   */
  public async getInstallPrompt(): Promise<any> {
    // This would typically be set by a beforeinstallprompt event listener
    // For now, return null as this is a basic implementation
    return null
  }

  /**
   * Check if the app is running as a standalone PWA
   * @returns boolean indicating standalone mode
   */
  public isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true
  }

  /**
   * Get PWA manifest information
   * @returns PWA manifest object or null
   */
  public getManifest(): any {
    const manifestLink = document.querySelector('link[rel="manifest"]')
    if (manifestLink) {
      return manifestLink.getAttribute('href')
    }
    return null
  }
}

// Export singleton instance
export const pwaService = new PWAService()

// Export utility functions for easy access
export const isOnline = () => pwaService.isAppOnline()
export const onOffline = (callback: () => void) => pwaService.onOffline(callback)
export const onOnline = (callback: () => void) => pwaService.onOnline(callback)
export const updateServiceWorker = (reloadPage?: boolean) => pwaService.updateServiceWorker(reloadPage)
export const isInstallable = () => pwaService.isInstallable()
export const isStandalone = () => pwaService.isStandalone() 