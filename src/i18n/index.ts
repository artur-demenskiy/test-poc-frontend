import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Import language resources
import en from './locales/en.json'
import ru from './locales/ru.json'
import es from './locales/es.json'
import de from './locales/de.json'
import fr from './locales/fr.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'
import ar from './locales/ar.json'

// Language resources with fallback to English
const resources = {
  en: { translation: en },
  ru: { translation: ru },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  zh: { translation: zh },
  ja: { translation: ja },
  ar: { translation: ar },
}

// Available languages configuration
export const availableLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
]

// Default language
export const defaultLanguage = 'en'

// RTL languages
export const rtlLanguages = ['ar', 'he', 'fa']

/**
 * Initialize i18n configuration with offline support and language detection
 */
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language resources
    resources,
    
    // Default language
    lng: defaultLanguage,
    
    // Fallback language
    fallbackLng: 'en',
    
    // Debug mode (disabled in production)
    debug: process.env.NODE_ENV === 'development',
    
    // Interpolation options
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    // Language detection options
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys for localStorage
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language
      caches: ['localStorage'],
      
      // Don't cache language in localStorage
      excludeCacheFor: ['cimode'],
    },
    
    // Backend options for dynamic loading
    backend: {
      // Load path for language files
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      
      // Fallback path
      fallbackPath: '/locales/en/{{ns}}.json',
      
      // Request options
      requestOptions: {
        cache: 'default',
      },
    },
    
    // React i18next options
    react: {
      // Use Suspense for loading
      useSuspense: true,
      
      // Bind to window for global access
      bindI18n: 'languageChanged loaded',
      
      // Bind to store for Redux integration
      bindI18nStore: 'added removed',
    },
    
    // Namespace options
    ns: ['translation'],
    defaultNS: 'translation',
    
    // Key separator
    keySeparator: '.',
    
    // Namespace separator
    nsSeparator: ':',
    
    // Plural separator
    pluralSeparator: '_',
    
    // Context separator
    contextSeparator: '_',
  })

export default i18n 