/**
 * Language Page Tests
 * Tests for the language settings page component
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import Language from '../Language'

// Mock the useLanguage hook
const mockUseLanguage = vi.fn()
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => mockUseLanguage(),
}))

// Mock the useTranslation hook
const mockUseTranslation = vi.fn()
vi.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation(),
}))

// Mock the LanguageSwitcher component
vi.mock('@/components/LanguageSwitcher', () => ({
  default: () => (
    <div data-testid="language-switcher">
      <button>🇺🇸 EN</button>
    </div>
  ),
}))

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
)

describe('Language Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementation for useLanguage
    mockUseLanguage.mockReturnValue({
      currentLanguage: 'en',
      isRTL: false,
      isChangingLanguage: false,
      changeLanguage: vi.fn(),
      getCurrentLanguageInfo: () => ({
        code: 'en',
        name: 'English',
        flag: '🇺🇸',
        dir: 'ltr',
      }),
      getAvailableLanguages: () => [
        { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
        { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
        { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
        { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
        { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
      ],
      isLanguageRTL: (code: string) => code === 'ar',
      getLanguageDisplayName: (code: string) => {
        const languages = {
          en: '🇺🇸 English',
          ru: '🇷🇺 Русский',
          es: '🇪🇸 Español',
          de: '🇩🇪 Deutsch',
          fr: '🇫🇷 Français',
          zh: '🇨🇳 中文',
          ja: '🇯🇵 日本語',
          ar: '🇸🇦 العربية',
        }
        return languages[code as keyof typeof languages] || code
      },
      resetToDefaultLanguage: vi.fn(),
      autoDetectLanguage: vi.fn(),
      getLanguageStats: () => ({
        currentLanguage: 'en',
        isRTL: false,
        availableLanguagesCount: 8,
        rtlLanguagesCount: 3,
        browserLanguage: 'en-US',
        storedLanguage: 'en',
        isOnline: true,
      }),
      t: (key: string) => {
        const translations: Record<string, string> = {
          'language.title': 'Language Settings',
          'language.subtitle': 'Choose your preferred language for the application',
          'language.currentLanguage': 'Current Language',
          'language.selectLanguage': 'Select Language',
          'language.preferredLanguage': 'Preferred Language',
          'language.rtlSupport': 'Right-to-Left Support',
          'language.rtlDescription': 'This language is displayed from right to left',
          'language.ltrDescription': 'This language is displayed from left to right',
          'language.autoDetect': 'Auto-detect',
          'language.systemLanguage': 'System Language',
          'language.availableLanguages': 'Available Languages',
          'language.browserLanguage': 'Browser Language',
          'common.loading': 'Loading...',
          'common.apply': 'Apply',
          'common.settings': 'Settings',
          'common.reset': 'Reset',
          'common.statistics': 'Statistics',
          'common.languages': 'Languages',
          'common.status': 'Status',
          'common.online': 'Online',
          'common.offline': 'Offline',
          'common.ready': 'Ready',
          'common.quickActions': 'Quick Actions',
          'common.information': 'Information',
          'common.direction': 'Direction',
          'common.tips': 'Tips',
          'common.offline': 'Offline',
          'common.support': 'Support',
          'common.persistent': 'Persistent',
          'common.preferences': 'Preferences',
        }
        return translations[key] || key
      },
    })

    // Default mock implementation for useTranslation
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          'language.title': 'Language Settings',
          'language.subtitle': 'Choose your preferred language for the application',
          'language.currentLanguage': 'Current Language',
          'language.selectLanguage': 'Select Language',
          'language.preferredLanguage': 'Preferred Language',
          'language.rtlSupport': 'Right-to-Left Support',
          'language.rtlDescription': 'This language is displayed from right to left',
          'language.ltrDescription': 'This language is displayed from left to right',
          'language.autoDetect': 'Auto-detect',
          'language.systemLanguage': 'System Language',
          'language.availableLanguages': 'Available Languages',
          'language.browserLanguage': 'Browser Language',
          'common.loading': 'Loading...',
          'common.apply': 'Apply',
          'common.settings': 'Settings',
          'common.reset': 'Reset',
          'common.statistics': 'Statistics',
          'common.languages': 'Languages',
          'common.status': 'Status',
          'common.online': 'Online',
          'common.offline': 'Offline',
          'common.ready': 'Ready',
          'common.quickActions': 'Quick Actions',
          'common.information': 'Information',
          'common.direction': 'Direction',
          'common.tips': 'Tips',
          'common.offline': 'Offline',
          'common.support': 'Support',
          'common.persistent': 'Persistent',
          'common.preferences': 'Preferences',
        }
        return translations[key] || key
      },
    })
  })

  describe('Rendering', () => {
    it('should render the page header correctly', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🌐 Language Settings')).toBeInTheDocument()
      expect(screen.getByText('Choose your preferred language for the application')).toBeInTheDocument()
    })

    it('should display current language information', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
      expect(screen.getByText('EN')).toBeInTheDocument()
    })

    it('should show language direction information', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('This language is displayed from left to right')).toBeInTheDocument()
    })

    it('should display RTL indicator for RTL languages', () => {
      // Mock RTL language
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ar',
        isRTL: true,
        isChangingLanguage: false,
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'ar',
          name: 'العربية',
          flag: '🇸🇦',
          dir: 'rtl',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('Right-to-Left Support')).toBeInTheDocument()
      expect(screen.getByText('This language is displayed from right to left')).toBeInTheDocument()
    })
  })

  describe('Language Selection', () => {
    it('should display all available languages', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('Русский')).toBeInTheDocument()
      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.getByText('🇩🇪')).toBeInTheDocument()
      expect(screen.getByText('Deutsch')).toBeInTheDocument()
      expect(screen.getByText('🇫🇷')).toBeInTheDocument()
      expect(screen.getByText('Français')).toBeInTheDocument()
      expect(screen.getByText('🇨🇳')).toBeInTheDocument()
      expect(screen.getByText('中文')).toBeInTheDocument()
      expect(screen.getByText('🇯🇵')).toBeInTheDocument()
      expect(screen.getByText('日本語')).toBeInTheDocument()
      expect(screen.getByText('🇸🇦')).toBeInTheDocument()
      expect(screen.getByText('العربية')).toBeInTheDocument()
    })

    it('should show language codes for all languages', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('RU')).toBeInTheDocument()
      expect(screen.getByText('ES')).toBeInTheDocument()
      expect(screen.getByText('DE')).toBeInTheDocument()
      expect(screen.getByText('FR')).toBeInTheDocument()
      expect(screen.getByText('ZH')).toBeInTheDocument()
      expect(screen.getByText('JA')).toBeInTheDocument()
      expect(screen.getByText('AR')).toBeInTheDocument()
    })

    it('should highlight current language', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      // Current language should have blue styling
      const currentLanguageButton = screen.getByText('English').closest('button')
      expect(currentLanguageButton).toHaveClass('border-blue-500', 'bg-blue-50')
    })

    it('should show RTL indicator for RTL languages', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      // Arabic should show RTL indicator
      const arabicButton = screen.getByText('العربية').closest('button')
      expect(arabicButton).toHaveTextContent('RTL')
      
      // English should not show RTL indicator
      const englishButton = screen.getByText('English').closest('button')
      expect(englishButton).not.toHaveTextContent('RTL')
    })

    it('should allow language selection', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const russianButton = screen.getByText('Русский').closest('button')
      fireEvent.click(russianButton!)

      // Selected language should be highlighted
      expect(russianButton).toHaveClass('border-blue-500', 'bg-blue-50')
    })

    it('should enable apply button when language is selected', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const russianButton = screen.getByText('Русский').closest('button')
      fireEvent.click(russianButton!)

      const applyButton = screen.getByText('Apply')
      expect(applyButton).not.toBeDisabled()
    })

    it('should disable apply button for current language', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const applyButton = screen.getByText('Apply')
      expect(applyButton).toBeDisabled()
    })
  })

  describe('Language Switcher Integration', () => {
    it('should render the language switcher component', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByTestId('language-switcher')).toBeInTheDocument()
    })

    it('should center the language switcher', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const switcherContainer = screen.getByTestId('language-switcher').parentElement
      expect(switcherContainer).toHaveClass('flex', 'justify-center')
    })
  })

  describe('Advanced Options', () => {
    it('should show advanced options when expanded', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      fireEvent.click(settingsButton)

      expect(screen.getByText('🔍 Auto-detect')).toBeInTheDocument()
      expect(screen.getByText('🔄 Reset')).toBeInTheDocument()
    })

    it('should hide advanced options when collapsed', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      
      // Initially collapsed
      expect(screen.queryByText('🔍 Auto-detect')).not.toBeInTheDocument()
      
      // Expand
      fireEvent.click(settingsButton)
      expect(screen.getByText('🔍 Auto-detect')).toBeInTheDocument()
      
      // Collapse
      fireEvent.click(settingsButton)
      expect(screen.queryByText('🔍 Auto-detect')).not.toBeInTheDocument()
    })

    it('should rotate arrow icon when expanded/collapsed', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      const arrow = settingsButton.querySelector('svg')
      
      // Initially not rotated
      expect(arrow).not.toHaveClass('rotate-90')
      
      // Expand
      fireEvent.click(settingsButton)
      expect(arrow).toHaveClass('rotate-90')
      
      // Collapse
      fireEvent.click(settingsButton)
      expect(arrow).not.toHaveClass('rotate-90')
    })
  })

  describe('Language Statistics', () => {
    it('should display language statistics when advanced options are expanded', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      fireEvent.click(settingsButton)

      expect(screen.getByText('📊 Statistics')).toBeInTheDocument()
      expect(screen.getByText('Available Languages:')).toBeInTheDocument()
      expect(screen.getByText('RTL Languages:')).toBeInTheDocument()
      expect(screen.getByText('Browser Language:')).toBeInTheDocument()
      expect(screen.getByText('Status:')).toBeInTheDocument()
    })

    it('should show correct statistics values', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      fireEvent.click(settingsButton)

      expect(screen.getByText('8')).toBeInTheDocument() // Available languages
      expect(screen.getByText('3')).toBeInTheDocument() // RTL languages
      expect(screen.getByText('en-US')).toBeInTheDocument() // Browser language
      expect(screen.getByText('Online')).toBeInTheDocument() // Status
    })
  })

  describe('Quick Actions Sidebar', () => {
    it('should render quick actions section', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('⚡ Quick Actions')).toBeInTheDocument()
    })

    it('should display auto-detect and reset buttons', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🔍 Auto-detect')).toBeInTheDocument()
      expect(screen.getByText('🔄 Reset')).toBeInTheDocument()
    })

    it('should style quick action buttons correctly', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const autoDetectButton = screen.getByText('🔍 Auto-detect')
      const resetButton = screen.getByText('🔄 Reset')

      expect(autoDetectButton).toHaveClass('bg-blue-600', 'text-white')
      expect(resetButton).toHaveClass('bg-gray-600', 'text-white')
    })
  })

  describe('Language Information Sidebar', () => {
    it('should render language information section', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('ℹ️ Information')).toBeInTheDocument()
    })

    it('should display current language information', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('Current Language:')).toBeInTheDocument()
      expect(screen.getByText('Direction:')).toBeInTheDocument()
      expect(screen.getByText('Status:')).toBeInTheDocument()
    })

    it('should show correct language information values', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🇺🇸 English')).toBeInTheDocument()
      expect(screen.getByText('This language is displayed from left to right')).toBeInTheDocument()
      expect(screen.getByText('Ready')).toBeInTheDocument()
    })
  })

  describe('Tips Section', () => {
    it('should render tips section', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('💡 Tips')).toBeInTheDocument()
    })

    it('should display helpful tips for users', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const tipsSection = screen.getByText('💡 Tips').closest('div')
      expect(tipsSection).toHaveTextContent('Auto-detect System Language')
      expect(tipsSection).toHaveTextContent('Right-to-Left Support')
      expect(tipsSection).toHaveTextContent('Offline Support')
      expect(tipsSection).toHaveTextContent('Persistent Preferences')
    })
  })

  describe('Responsive Layout', () => {
    it('should use grid layout for different screen sizes', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const mainContainer = screen.getByText('🌐 Language Settings').closest('.grid')
      expect(mainContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-3')
    })

    it('should have main content spanning 2 columns on large screens', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const mainContent = screen.getByText('Current Language').closest('.lg\\:col-span-2')
      expect(mainContent).toBeInTheDocument()
    })

    it('should have sidebar on the right', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const sidebar = screen.getByText('⚡ Quick Actions').closest('.space-y-6')
      expect(sidebar).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should show loading state when changing language', () => {
      // Mock loading state
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'en',
        isRTL: false,
        isChangingLanguage: true, // Loading state
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should disable buttons during language change', () => {
      // Mock loading state
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'en',
        isRTL: false,
        isChangingLanguage: true,
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const autoDetectButton = screen.getByText('🔍 Auto-detect')
      const resetButton = screen.getByText('🔄 Reset')

      expect(autoDetectButton).toBeDisabled()
      expect(resetButton).toBeDisabled()
    })
  })

  describe('Error Handling', () => {
    it('should handle language change errors gracefully', async () => {
      const mockChangeLanguage = vi.fn().mockRejectedValue(new Error('Failed to change language'))
      
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'en',
        isRTL: false,
        isChangingLanguage: false,
        changeLanguage: mockChangeLanguage,
        getCurrentLanguageInfo: () => ({
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const russianButton = screen.getByText('Русский').closest('button')
      fireEvent.click(russianButton!)

      const applyButton = screen.getByText('Apply')
      fireEvent.click(applyButton)

      await waitFor(() => {
        expect(mockChangeLanguage).toHaveBeenCalledWith('ru')
      })
    })

    it('should handle auto-detect errors gracefully', async () => {
      const mockAutoDetect = vi.fn().mockRejectedValue(new Error('Failed to auto-detect'))
      
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'en',
        isRTL: false,
        isChangingLanguage: false,
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: mockAutoDetect,
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const settingsButton = screen.getByText('🛠️ Settings')
      fireEvent.click(settingsButton)

      const autoDetectButton = screen.getByText('🔍 Auto-detect')
      fireEvent.click(autoDetectButton)

      await waitFor(() => {
        expect(mockAutoDetect).toHaveBeenCalled()
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const mainHeading = screen.getByRole('heading', { level: 1 })
      expect(mainHeading).toHaveTextContent('🌐 Language Settings')

      const sectionHeadings = screen.getAllByRole('heading', { level: 2 })
      expect(sectionHeadings.length).toBeGreaterThan(0)
    })

    it('should have proper button roles', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)

      buttons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button')
      })
    })

    it('should have proper form structure', () => {
      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      // Language selection should be properly structured
      const languageButtons = screen.getAllByRole('button')
      expect(languageButtons.length).toBeGreaterThan(8) // Main buttons + language options
    })
  })

  describe('Internationalization', () => {
    it('should use translation function for all text', () => {
      const mockT = vi.fn((key: string) => `Translated: ${key}`)
      
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'en',
        isRTL: false,
        isChangingLanguage: false,
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'en',
          name: 'English',
          flag: '🇺🇸',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: mockT,
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      // Should use translation function
      expect(mockT).toHaveBeenCalled()
    })

    it('should support different languages', () => {
      // Mock different language
      mockUseLanguage.mockReturnValue({
        currentLanguage: 'ru',
        isRTL: false,
        isChangingLanguage: false,
        changeLanguage: vi.fn(),
        getCurrentLanguageInfo: () => ({
          code: 'ru',
          name: 'Русский',
          flag: '🇷🇺',
          dir: 'ltr',
        }),
        getAvailableLanguages: () => [],
        isLanguageRTL: vi.fn(),
        getLanguageDisplayName: vi.fn(),
        resetToDefaultLanguage: vi.fn(),
        autoDetectLanguage: vi.fn(),
        getLanguageStats: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <Language />
        </TestWrapper>
      )

      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('Русский')).toBeInTheDocument()
      expect(screen.getByText('RU')).toBeInTheDocument()
    })
  })
}) 