import React, { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'

/**
 * Language Settings Page
 * Comprehensive language management with offline support and RTL handling
 */
const Language: React.FC = () => {
  const { t } = useTranslation()
  const {
    currentLanguage,
    isRTL,
    isChangingLanguage,
    changeLanguage,
    getCurrentLanguageInfo,
    getAvailableLanguages,
    isLanguageRTL,
    getLanguageDisplayName,
    resetToDefaultLanguage,
    autoDetectLanguage,
    getLanguageStats,
  } = useLanguage()

  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLanguage)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  // Get current language info
  const currentLangInfo = getCurrentLanguageInfo()
  
  // Get available languages
  const availableLanguages = getAvailableLanguages()
  
  // Get language statistics
  const languageStats = getLanguageStats()

  /**
   * Handle language change
   */
  const handleLanguageChange = async () => {
    if (selectedLanguage === currentLanguage) return
    
    try {
      await changeLanguage(selectedLanguage)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  /**
   * Handle auto-detection
   */
  const handleAutoDetect = async () => {
    try {
      await autoDetectLanguage()
    } catch (error) {
      console.error('Failed to auto-detect language:', error)
    }
  }

  /**
   * Handle reset to default
   */
  const handleResetToDefault = async () => {
    try {
      await resetToDefaultLanguage()
      setSelectedLanguage(currentLanguage)
    } catch (error) {
      console.error('Failed to reset language:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🌐 {t('language.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('language.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Language Display */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('language.currentLanguage')}
              </h2>
              
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-4xl" role="img" aria-label={currentLangInfo.name}>
                  {currentLangInfo.flag}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    {currentLangInfo.name}
                  </h3>
                  <p className="text-blue-700">
                    {currentLangInfo.code.toUpperCase()}
                    {isRTL && (
                      <span className="ml-2 text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        {t('language.rtlSupport')}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {isRTL ? t('language.rtlDescription') : t('language.ltrDescription')}
                  </p>
                </div>
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {t('language.selectLanguage')}
              </h2>
              
              <div className="space-y-4">
                {/* Language Switcher Component */}
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
                
                {/* Manual Language Selection */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">
                    {t('language.preferredLanguage')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setSelectedLanguage(lang.code)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${selectedLanguage === lang.code
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl" role="img" aria-label={lang.name}>
                            {lang.flag}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{lang.name}</div>
                            <div className="text-sm text-gray-500">
                              {lang.code.toUpperCase()}
                              {lang.dir === 'rtl' && (
                                <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                                  RTL
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedLanguage === lang.code && (
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
                    ))}
                  </div>
                  
                  {/* Apply Button */}
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={handleLanguageChange}
                      disabled={selectedLanguage === currentLanguage || isChangingLanguage}
                      className={`
                        px-6 py-3 rounded-md font-medium transition-colors duration-200
                        ${selectedLanguage === currentLanguage || isChangingLanguage
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                      `}
                    >
                      {isChangingLanguage ? t('common.loading') : t('common.apply')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-lg font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
              >
                <svg
                  className={`w-5 h-5 transition-transform duration-200 ${
                    showAdvanced ? 'rotate-90' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                <span>🛠️ {t('common.settings')}</span>
              </button>
              
              {showAdvanced && (
                <div className="mt-6 space-y-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleAutoDetect}
                      disabled={isChangingLanguage}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      🔍 {t('language.autoDetect')}
                    </button>
                    
                    <button
                      onClick={handleResetToDefault}
                      disabled={isChangingLanguage}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50"
                    >
                      🔄 {t('common.reset')}
                    </button>
                  </div>
                  
                  {/* Language Statistics */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-3">📊 {t('common.statistics')}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">{t('language.availableLanguages')}:</span>
                        <span className="ml-2 font-medium">{languageStats.availableLanguagesCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">RTL {t('common.languages')}:</span>
                        <span className="ml-2 font-medium">{languageStats.rtlLanguagesCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('language.browserLanguage')}:</span>
                        <span className="ml-2 font-medium">{languageStats.browserLanguage}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('common.status')}:</span>
                        <span className={`ml-2 font-medium ${languageStats.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                          {languageStats.isOnline ? t('common.online') : t('common.offline')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ⚡ {t('common.quickActions')}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleAutoDetect}
                  disabled={isChangingLanguage}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 text-sm"
                >
                  🔍 {t('language.autoDetect')}
                </button>
                <button
                  onClick={handleResetToDefault}
                  disabled={isChangingLanguage}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 text-sm"
                >
                  🔄 {t('common.reset')}
                </button>
              </div>
            </div>

            {/* Language Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                ℹ️ {t('common.information')}
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>{t('language.currentLanguage')}:</strong><br />
                  {getLanguageDisplayName(currentLanguage)}
                </p>
                <p>
                  <strong>{t('common.direction')}:</strong><br />
                  {isRTL ? t('language.rtlSupport') : t('language.ltrDescription')}
                </p>
                <p>
                  <strong>{t('common.status')}:</strong><br />
                  <span className={isChangingLanguage ? 'text-yellow-600' : 'text-green-600'}>
                    {isChangingLanguage ? t('common.loading') : t('common.ready')}
                  </span>
                </p>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                💡 {t('common.tips')}
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• {t('language.autoDetect')} {t('language.systemLanguage')}</li>
                <li>• {t('language.rtlSupport')} {t('language.rtlDescription')}</li>
                <li>• {t('common.offline')} {t('common.support')}</li>
                <li>• {t('common.persistent')} {t('common.preferences')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Language 