import React, { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'

/**
 * Language Switcher Component
 * Provides a dropdown interface for changing application language
 * Supports offline language switching and RTL languages
 */
export const LanguageSwitcher: React.FC = () => {
  const {
    currentLanguage,
    isRTL,
    isChangingLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    getLanguageDisplayName,
    t,
  } = useLanguage()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Get current language info
  const currentLangInfo = getCurrentLanguageInfo()
  
  // Get available languages
  const availableLanguages = getAvailableLanguages()

  // Filter languages based on search term
  const filteredLanguages = availableLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  /**
   * Handle language selection
   */
  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode)
      setIsOpen(false)
      setSearchTerm('')
    } catch (error) {
      console.error('Failed to change language:', error)
      // You could show a toast notification here
    }
  }

  /**
   * Toggle dropdown
   */
  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm('')
    }
  }

  /**
   * Close dropdown when clicking outside
   */
  const handleClickOutside = (event: React.MouseEvent) => {
    if (!(event.target as Element).closest('.language-switcher')) {
      setIsOpen(false)
      setSearchTerm('')
    }
  }

  return (
    <div className="language-switcher relative">
      {/* Language Button */}
      <button
        onClick={toggleDropdown}
        disabled={isChangingLanguage}
        className={`
          flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium
          transition-colors duration-200 border
          ${isChangingLanguage 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
          ${isRTL ? 'space-x-reverse' : ''}
        `}
        aria-label={t('language.selectLanguage')}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Current Language Flag */}
        <span className="text-lg" role="img" aria-label={currentLangInfo.name}>
          {currentLangInfo.flag}
        </span>
        
        {/* Current Language Code */}
        <span className="hidden sm:inline-block">
          {currentLangInfo.code.toUpperCase()}
        </span>
        
        {/* Dropdown Arrow */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50"
          style={{
            [isRTL ? 'right' : 'left']: '0',
          }}
        >
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>

          {/* Language List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                    ${currentLanguage === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                    ${isRTL ? 'text-right' : 'text-left'}
                  `}
                  disabled={currentLanguage === lang.code || isChangingLanguage}
                >
                  <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
                    {/* Language Flag */}
                    <span className="text-xl" role="img" aria-label={lang.name}>
                      {lang.flag}
                    </span>
                    
                    {/* Language Info */}
                    <div className="flex-1">
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-sm text-gray-500">
                        {lang.code.toUpperCase()}
                        {lang.dir === 'rtl' && (
                          <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                            RTL
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Current Language Indicator */}
                    {currentLanguage === lang.code && (
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                {t('common.noResults')}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-500 text-center">
              {t('language.currentLanguage')}: {getLanguageDisplayName(currentLanguage)}
            </div>
          </div>
        </div>
      )}

      {/* Backdrop for closing dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}
    </div>
  )
}

export default LanguageSwitcher 