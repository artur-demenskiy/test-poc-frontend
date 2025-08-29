/**
 * useLanguage Hook Tests
 * Tests for the custom language management hook
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { useLanguage } from '../useLanguage'

// Mock the useOffline hook
vi.mock('@/hooks/useOffline', () => ({
  useOffline: () => ({
    isOnline: true,
    isOffline: false,
  }),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock Cache API
const cacheMock = {
  open: vi.fn(),
  put: vi.fn(),
  match: vi.fn(),
}
Object.defineProperty(window, 'caches', {
  value: {
    open: vi.fn(() => Promise.resolve(cacheMock)),
  },
})

// Mock document properties
Object.defineProperty(document, 'documentElement', {
  value: {
    dir: 'ltr',
    lang: 'en',
  },
  writable: true,
})

Object.defineProperty(document, 'body', {
  value: {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
      contains: vi.fn(),
    },
  },
  writable: true,
})

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    {children}
  </I18nextProvider>
)

describe('useLanguage Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('en')
    
    // Reset document properties
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'
    
    // Reset body classes
    document.body.classList.add = vi.fn()
    document.body.classList.remove = vi.fn()
    document.body.classList.contains = vi.fn()
  })

  afterEach(() => {
    // Clean up event listeners
    i18n.off('languageChanged')
  })

  describe('Initialization', () => {
    it('should initialize with default language', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('en')
      expect(result.current.isRTL).toBe(false)
      expect(result.current.isChangingLanguage).toBe(false)
    })

    it('should initialize with stored language preference', () => {
      localStorageMock.getItem.mockReturnValue('ru')
      
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('ru')
    })

    it('should initialize with i18n detected language', () => {
      localStorageMock.getItem.mockReturnValue(null)
      i18n.language = 'es'
      
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('es')
    })

    it('should fallback to default language on error', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })
      
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('en')
    })
  })

  describe('Language State Management', () => {
    it('should track current language state', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('en')
      
      act(() => {
        result.current.changeLanguage('ru')
      })

      expect(result.current.currentLanguage).toBe('ru')
    })

    it('should track RTL state', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.isRTL).toBe(false)
      
      act(() => {
        result.current.changeLanguage('ar')
      })

      expect(result.current.isRTL).toBe(true)
    })

    it('should track language change loading state', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.isChangingLanguage).toBe(false)
      
      act(() => {
        result.current.changeLanguage('ru')
      })

      expect(result.current.isChangingLanguage).toBe(true)
      
      await waitFor(() => {
        expect(result.current.isChangingLanguage).toBe(false)
      })
    })
  })

  describe('Language Switching', () => {
    it('should change language successfully', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('ru')
      })

      expect(result.current.currentLanguage).toBe('ru')
      expect(result.current.isRTL).toBe(false)
    })

    it('should not change language if same language is selected', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const initialLanguage = result.current.currentLanguage
      
      await act(async () => {
        await result.current.changeLanguage('en')
      })

      expect(result.current.currentLanguage).toBe(initialLanguage)
    })

    it('should handle language change errors gracefully', async () => {
      // Mock failed language change
      const originalChangeLanguage = i18n.changeLanguage
      i18n.changeLanguage = vi.fn().mockRejectedValue(new Error('Failed to load language'))

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await expect(
        act(async () => {
          await result.current.changeLanguage('invalid')
        })
      ).rejects.toThrow('Failed to load language')

      // Should maintain current language
      expect(result.current.currentLanguage).toBe('en')

      // Restore original method
      i18n.changeLanguage = originalChangeLanguage
    })

    it('should update i18n language', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('ru')
      })

      expect(i18n.language).toBe('ru')
    })
  })

  describe('RTL Support', () => {
    it('should detect RTL languages correctly', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.isLanguageRTL('ar')).toBe(true)
      expect(result.current.isLanguageRTL('he')).toBe(true)
      expect(result.current.isLanguageRTL('fa')).toBe(true)
      expect(result.current.isLanguageRTL('en')).toBe(false)
      expect(result.current.isLanguageRTL('ru')).toBe(false)
    })

    it('should update document direction for RTL languages', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('ar')
      })

      expect(document.documentElement.dir).toBe('rtl')
      expect(document.documentElement.lang).toBe('ar')
    })

    it('should update document direction for LTR languages', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('en')
      })

      expect(document.documentElement.dir).toBe('ltr')
      expect(document.documentElement.lang).toBe('en')
    })

    it('should add RTL class to body for RTL languages', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('ar')
      })

      expect(document.body.classList.add).toHaveBeenCalledWith('rtl')
      expect(document.body.classList.remove).toHaveBeenCalledWith('ltr')
    })

    it('should add LTR class to body for LTR languages', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('en')
      })

      expect(document.body.classList.add).toHaveBeenCalledWith('ltr')
      expect(document.body.classList.remove).toHaveBeenCalledWith('rtl')
    })
  })

  describe('Offline Persistence', () => {
    it('should persist language preference in localStorage', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('ru')
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'ru')
    })

    it('should cache language preference in Cache API', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.changeLanguage('fr')
      })

      expect(window.caches.open).toHaveBeenCalledWith('language-preference')
      expect(cacheMock.put).toHaveBeenCalledWith('/language-preference', expect.any(Response))
    })

    it('should handle Cache API errors gracefully', async () => {
      // Mock Cache API error
      window.caches.open = vi.fn().mockRejectedValue(new Error('Cache error'))

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // Should not throw error
      await expect(
        act(async () => {
          await result.current.changeLanguage('de')
        })
      ).resolves.not.toThrow()

      // Should still persist in localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'de')
    })

    it('should restore language preference from localStorage on mount', () => {
      localStorageMock.getItem.mockReturnValue('ja')
      
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.currentLanguage).toBe('ja')
    })
  })

  describe('Language Information', () => {
    it('should get current language info', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const currentLangInfo = result.current.getCurrentLanguageInfo()
      
      expect(currentLangInfo.code).toBe('en')
      expect(currentLangInfo.name).toBe('English')
      expect(currentLangInfo.flag).toBe('🇺🇸')
      expect(currentLangInfo.dir).toBe('ltr')
    })

    it('should get all available languages', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const availableLanguages = result.current.getAvailableLanguages()
      
      expect(availableLanguages).toHaveLength(8)
      expect(availableLanguages.find(lang => lang.code === 'en')).toBeDefined()
      expect(availableLanguages.find(lang => lang.code === 'ru')).toBeDefined()
      expect(availableLanguages.find(lang => lang.code === 'ar')).toBeDefined()
    })

    it('should get language display name with flag', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.getLanguageDisplayName('en')).toBe('🇺🇸 English')
      expect(result.current.getLanguageDisplayName('ru')).toBe('🇷🇺 Русский')
      expect(result.current.getLanguageDisplayName('ar')).toBe('🇸🇦 العربية')
    })

    it('should return language code for unknown languages', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(result.current.getLanguageDisplayName('unknown')).toBe('unknown')
    })
  })

  describe('Auto-detection and Reset', () => {
    it('should auto-detect browser language', async () => {
      // Mock navigator.language
      Object.defineProperty(navigator, 'language', {
        value: 'es-ES',
        configurable: true,
      })

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.autoDetectLanguage()
      })

      expect(result.current.currentLanguage).toBe('es')
    })

    it('should fallback to default language for unsupported browser language', async () => {
      // Mock unsupported language
      Object.defineProperty(navigator, 'language', {
        value: 'xx-XX',
        configurable: true,
      })

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await act(async () => {
        await result.current.autoDetectLanguage()
      })

      expect(result.current.currentLanguage).toBe('en')
    })

    it('should not change language if detected language is same as current', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const initialLanguage = result.current.currentLanguage
      
      await act(async () => {
        await result.current.autoDetectLanguage()
      })

      expect(result.current.currentLanguage).toBe(initialLanguage)
    })

    it('should reset to default language', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // First change to different language
      await act(async () => {
        await result.current.changeLanguage('ru')
      })

      expect(result.current.currentLanguage).toBe('ru')

      // Then reset to default
      await act(async () => {
        await result.current.resetToDefaultLanguage()
      })

      expect(result.current.currentLanguage).toBe('en')
    })
  })

  describe('Language Statistics', () => {
    it('should provide comprehensive language statistics', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const stats = result.current.getLanguageStats()
      
      expect(stats.currentLanguage).toBe('en')
      expect(stats.isRTL).toBe(false)
      expect(stats.availableLanguagesCount).toBe(8)
      expect(stats.rtlLanguagesCount).toBe(3)
      expect(stats.browserLanguage).toBeDefined()
      expect(stats.storedLanguage).toBe('en')
      expect(stats.isOnline).toBe(true)
    })

    it('should update statistics when language changes', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const initialStats = result.current.getLanguageStats()
      expect(initialStats.currentLanguage).toBe('en')
      expect(initialStats.isRTL).toBe(false)

      await act(async () => {
        await result.current.changeLanguage('ar')
      })

      const updatedStats = result.current.getLanguageStats()
      expect(updatedStats.currentLanguage).toBe('ar')
      expect(updatedStats.isRTL).toBe(true)
    })
  })

  describe('Event Handling', () => {
    it('should listen for i18n language change events', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // Simulate i18n language change event
      act(() => {
        i18n.emit('languageChanged', 'fr')
      })

      expect(result.current.currentLanguage).toBe('fr')
    })

    it('should clean up event listeners on unmount', () => {
      const { unmount } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      unmount()

      // Event listeners should be cleaned up
      expect(i18n.off).toHaveBeenCalledWith('languageChanged', expect.any(Function))
    })
  })

  describe('Translation Helper', () => {
    it('should provide translation function', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      expect(typeof result.current.t).toBe('function')
      expect(result.current.t('home.title')).toBe('React TypeScript Boilerplate')
    })

    it('should support interpolation', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const translation = result.current.t('validation.minLength', { min: 8 })
      expect(translation).toBe('Minimum length is 8 characters')
    })

    it('should support pluralization', () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const singular = result.current.t('time.second', { count: 1 })
      const plural = result.current.t('time.seconds', { count: 5 })
      
      expect(singular).toBe('1 second')
      expect(plural).toBe('5 seconds')
    })
  })

  describe('Performance and Optimization', () => {
    it('should memoize language change function', () => {
      const { result, rerender } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const firstChangeLanguage = result.current.changeLanguage
      
      rerender()
      
      const secondChangeLanguage = result.current.changeLanguage
      
      expect(firstChangeLanguage).toBe(secondChangeLanguage)
    })

    it('should memoize language info functions', () => {
      const { result, rerender } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      const firstGetCurrentLanguageInfo = result.current.getCurrentLanguageInfo
      const firstGetAvailableLanguages = result.current.getAvailableLanguages
      
      rerender()
      
      const secondGetCurrentLanguageInfo = result.current.getCurrentLanguageInfo
      const secondGetAvailableLanguages = result.current.getAvailableLanguages
      
      expect(firstGetCurrentLanguageInfo).toBe(secondGetCurrentLanguageInfo)
      expect(firstGetAvailableLanguages).toBe(secondGetAvailableLanguages)
    })

    it('should only update document properties when necessary', async () => {
      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // Initial setup
      expect(document.body.classList.add).toHaveBeenCalledWith('ltr')
      expect(document.body.classList.remove).toHaveBeenCalledWith('rtl')

      // Reset mocks
      vi.clearAllMocks()

      // Change to another LTR language
      await act(async () => {
        await result.current.changeLanguage('ru')
      })

      // Should still add LTR class
      expect(document.body.classList.add).toHaveBeenCalledWith('ltr')
      expect(document.body.classList.remove).toHaveBeenCalledWith('rtl')
    })
  })

  describe('Error Boundaries', () => {
    it('should handle localStorage errors gracefully', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded')
      })

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // Should not throw error
      expect(() => {
        result.current.changeLanguage('ru')
      }).not.toThrow()
    })

    it('should handle Cache API errors gracefully', () => {
      window.caches.open = vi.fn().mockRejectedValue(new Error('Cache not supported'))

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      // Should not throw error
      expect(() => {
        result.current.changeLanguage('de')
      }).not.toThrow()
    })

    it('should handle i18n errors gracefully', async () => {
      // Mock i18n error
      const originalChangeLanguage = i18n.changeLanguage
      i18n.changeLanguage = vi.fn().mockRejectedValue(new Error('i18n error'))

      const { result } = renderHook(() => useLanguage(), {
        wrapper: TestWrapper,
      })

      await expect(
        result.current.changeLanguage('invalid')
      ).rejects.toThrow('i18n error')

      // Restore original method
      i18n.changeLanguage = originalChangeLanguage
    })
  })
}) 