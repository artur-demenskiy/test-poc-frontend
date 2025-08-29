import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { availableLanguages, defaultLanguage, rtlLanguages } from '@/i18n'
import { useOffline } from './useOffline'

/**
 * Custom hook for language management with offline support and RTL handling
 * Provides language switching, RTL detection, and offline language persistence
 */
export const useLanguage = () => {
  const { i18n, t } = useTranslation()
  const { isOnline } = useOffline()
  
  // Current language state
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || defaultLanguage)
  
  // RTL state
  const [isRTL, setIsRTL] = useState<boolean>(rtlLanguages.includes(currentLanguage))
  
  // Language change loading state
  const [isChangingLanguage, setIsChangingLanguage] = useState<boolean>(false)

  /**
   * Change application language with offline support
   * @param languageCode - The language code to switch to
   */
  const changeLanguage = useCallback(async (languageCode: string) => {
    if (currentLanguage === languageCode) return

    setIsChangingLanguage(true)
    
    try {
      // Change i18n language
      await i18n.changeLanguage(languageCode)
      
      // Update current language state
      setCurrentLanguage(languageCode)
      
      // Update RTL state
      setIsRTL(rtlLanguages.includes(languageCode))
      
      // Update document direction
      document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr'
      
      // Update document language attribute
      document.documentElement.lang = languageCode
      
      // Store language preference in localStorage for offline persistence
      localStorage.setItem('i18nextLng', languageCode)
      
      // Store language preference in cache for offline use
      if ('caches' in window) {
        try {
          const cache = await caches.open('language-preference')
          await cache.put('/language-preference', new Response(languageCode))
        } catch (error) {
          console.warn('Failed to cache language preference:', error)
        }
      }
      
      console.log(`Language changed to: ${languageCode}`)
    } catch (error) {
      console.error('Failed to change language:', error)
      throw error
    } finally {
      setIsChangingLanguage(false)
    }
  }, [currentLanguage, i18n])

  /**
   * Get current language info
   */
  const getCurrentLanguageInfo = useCallback(() => {
    return availableLanguages.find(lang => lang.code === currentLanguage) || availableLanguages[0]
  }, [currentLanguage])

  /**
   * Get all available languages
   */
  const getAvailableLanguages = useCallback(() => {
    return availableLanguages
  }, [])

  /**
   * Check if a language is RTL
   */
  const isLanguageRTL = useCallback((languageCode: string) => {
    return rtlLanguages.includes(languageCode)
  }, [])

  /**
   * Get language display name with flag
   */
  const getLanguageDisplayName = useCallback((languageCode: string) => {
    const lang = availableLanguages.find(l => l.code === languageCode)
    return lang ? `${lang.flag} ${lang.name}` : languageCode
  }, [])

  /**
   * Reset language to default
   */
  const resetToDefaultLanguage = useCallback(async () => {
    await changeLanguage(defaultLanguage)
  }, [changeLanguage])

  /**
   * Auto-detect language based on browser settings
   */
  const autoDetectLanguage = useCallback(async () => {
    const browserLanguage = navigator.language.split('-')[0]
    const detectedLanguage = availableLanguages.find(lang => 
      lang.code === browserLanguage
    )?.code || defaultLanguage
    
    if (detectedLanguage !== currentLanguage) {
      await changeLanguage(detectedLanguage)
    }
  }, [currentLanguage, changeLanguage])

  /**
   * Get language statistics for analytics
   */
  const getLanguageStats = useCallback(() => {
    return {
      currentLanguage,
      isRTL,
      availableLanguagesCount: availableLanguages.length,
      rtlLanguagesCount: rtlLanguages.length,
      browserLanguage: navigator.language,
      storedLanguage: localStorage.getItem('i18nextLng'),
      isOnline,
    }
  }, [currentLanguage, isRTL, isOnline])

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // Try to get stored language preference
        const storedLanguage = localStorage.getItem('i18nextLng')
        
        if (storedLanguage && availableLanguages.some(lang => lang.code === storedLanguage)) {
          await changeLanguage(storedLanguage)
        } else if (i18n.language && i18n.language !== defaultLanguage) {
          // Use i18n detected language if available
          await changeLanguage(i18n.language)
        } else {
          // Use default language
          await changeLanguage(defaultLanguage)
        }
      } catch (error) {
        console.error('Failed to initialize language:', error)
        // Fallback to default language
        await changeLanguage(defaultLanguage)
      }
    }

    initializeLanguage()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Update document attributes when language changes
  useEffect(() => {
    // Update document direction
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    
    // Update document language
    document.documentElement.lang = currentLanguage
    
    // Add/remove RTL-specific CSS classes
    if (isRTL) {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }
  }, [currentLanguage, isRTL])

  // Listen for language changes from i18n
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng)
      setIsRTL(rtlLanguages.includes(lng))
    }

    i18n.on('languageChanged', handleLanguageChanged)
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged)
    }
  }, [i18n])

  return {
    // Language state
    currentLanguage,
    isRTL,
    isChangingLanguage,
    
    // Language actions
    changeLanguage,
    resetToDefaultLanguage,
    autoDetectLanguage,
    
    // Language info
    getCurrentLanguageInfo,
    getAvailableLanguages,
    isLanguageRTL,
    getLanguageDisplayName,
    
    // Language statistics
    getLanguageStats,
    
    // Translation helper
    t,
  }
} 