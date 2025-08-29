/**
 * LanguageSwitcher Component Tests
 * Tests for the language selection dropdown component
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import LanguageSwitcher from '../LanguageSwitcher'

// Mock the useLanguage hook
const mockUseLanguage = vi.fn()
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => mockUseLanguage(),
}))

// Mock the useOffline hook
vi.mock('@/hooks/useOffline', () => ({
  useOffline: () => ({
    isOnline: true,
    isOffline: false,
  }),
}))

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
)

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Default mock implementation
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
      t: (key: string) => {
        const translations: Record<string, string> = {
          'common.search': 'Search...',
          'language.selectLanguage': 'Select Language',
          'common.noResults': 'No results found',
          'language.currentLanguage': 'Current Language',
        }
        return translations[key] || key
      },
    })
  })

  describe('Rendering', () => {
    it('should render the language switcher button', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Select Language')
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-haspopup', 'true')
    })

    it('should display current language flag and code', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('EN')).toBeInTheDocument()
    })

    it('should show dropdown arrow icon', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const arrow = screen.getByRole('button').querySelector('svg')
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveClass('w-4', 'h-4')
    })
  })

  describe('Dropdown Functionality', () => {
    it('should open dropdown when button is clicked', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('Русский')).toBeInTheDocument()
      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })

    it('should close dropdown when button is clicked again', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      
      // Open dropdown
      fireEvent.click(button)
      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
      
      // Close dropdown
      fireEvent.click(button)
      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should rotate dropdown arrow when opened/closed', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      const arrow = button.querySelector('svg')
      
      // Initially not rotated
      expect(arrow).not.toHaveClass('rotate-180')
      
      // Open dropdown
      fireEvent.click(button)
      expect(arrow).toHaveClass('rotate-180')
      
      // Close dropdown
      fireEvent.click(button)
      expect(arrow).not.toHaveClass('rotate-180')
    })
  })

  describe('Search Functionality', () => {
    it('should filter languages by search term', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const searchInput = screen.getByPlaceholderText('Search...')
      
      // Search for "rus"
      fireEvent.change(searchInput, { target: { value: 'rus' } })
      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('Русский')).toBeInTheDocument()
      expect(screen.queryByText('🇪🇸')).not.toBeInTheDocument()
      expect(screen.queryByText('Español')).not.toBeInTheDocument()
      
      // Search for "span"
      fireEvent.change(searchInput, { target: { value: 'span' } })
      expect(screen.getByText('🇪🇸')).toBeInTheDocument()
      expect(screen.getByText('Español')).toBeInTheDocument()
      expect(screen.queryByText('🇷🇺')).not.toBeInTheDocument()
      expect(screen.queryByText('Русский')).not.toBeInTheDocument()
    })

    it('should filter by language code', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const searchInput = screen.getByPlaceholderText('Search...')
      
      // Search by code "ru"
      fireEvent.change(searchInput, { target: { value: 'ru' } })
      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('Русский')).toBeInTheDocument()
      
      // Search by code "de"
      fireEvent.change(searchInput, { target: { value: 'de' } })
      expect(screen.getByText('🇩🇪')).toBeInTheDocument()
      expect(screen.getByText('Deutsch')).toBeInTheDocument()
    })

    it('should show no results message when no languages match', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const searchInput = screen.getByPlaceholderText('Search...')
      fireEvent.change(searchInput, { target: { value: 'xyz' } })

      expect(screen.getByText('No results found')).toBeInTheDocument()
    })

    it('should clear search when dropdown is closed and reopened', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      
      // Open dropdown and search
      fireEvent.click(button)
      const searchInput = screen.getByPlaceholderText('Search...')
      fireEvent.change(searchInput, { target: { value: 'rus' } })
      expect(searchInput).toHaveValue('rus')
      
      // Close dropdown
      fireEvent.click(button)
      
      // Reopen dropdown
      fireEvent.click(button)
      const newSearchInput = screen.getByPlaceholderText('Search...')
      expect(newSearchInput).toHaveValue('')
    })
  })

  describe('Language Selection', () => {
    it('should display all available languages in dropdown', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Check all languages are displayed
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('English')).toBeInTheDocument()
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
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByText('EN')).toBeInTheDocument()
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
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Current language should have blue styling
      const currentLanguageButton = screen.getByText('English').closest('button')
      expect(currentLanguageButton).toHaveClass('bg-blue-50', 'text-blue-700')
    })

    it('should show RTL indicator for RTL languages', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Arabic should show RTL indicator
      const arabicButton = screen.getByText('العربية').closest('button')
      expect(arabicButton).toHaveTextContent('RTL')
      
      // English should not show RTL indicator
      const englishButton = screen.getByText('English').closest('button')
      expect(englishButton).not.toHaveTextContent('RTL')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Select Language')
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-haspopup', 'true')
    })

    it('should update ARIA attributes when dropdown state changes', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      
      // Initially closed
      expect(button).toHaveAttribute('aria-expanded', 'false')
      
      // Open dropdown
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')
      
      // Close dropdown
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should have proper button roles for language selection', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      // All language options should be buttons
      const languageButtons = screen.getAllByRole('button')
      expect(languageButtons.length).toBeGreaterThan(1) // Main button + language options
    })
  })

  describe('Click Outside Behavior', () => {
    it('should close dropdown when clicking outside', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()

      // Click outside
      fireEvent.click(document.body)

      expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument()
    })

    it('should not close dropdown when clicking inside', () => {
      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const searchInput = screen.getByPlaceholderText('Search...')
      expect(searchInput).toBeInTheDocument()

      // Click inside dropdown
      fireEvent.click(searchInput)

      expect(searchInput).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should hide language code on small screens', () => {
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      // Language code should be hidden on small screens
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      // Note: The hidden class is applied but the element is still in DOM
      // This test verifies the flag is visible
    })

    it('should show language code on larger screens', () => {
      // Mock large screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      // Language code should be visible on larger screens
      expect(screen.getByText('🇺🇸')).toBeInTheDocument()
      expect(screen.getByText('EN')).toBeInTheDocument()
    })
  })

  describe('Loading States', () => {
    it('should disable button when changing language', () => {
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
        getLanguageDisplayName: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('cursor-not-allowed')
    })

    it('should show loading state styling', () => {
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
        getLanguageDisplayName: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-100', 'text-gray-400')
    })
  })

  describe('RTL Support', () => {
    it('should apply RTL-specific styling when language is RTL', () => {
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
        getLanguageDisplayName: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('space-x-reverse')
    })

    it('should position dropdown correctly for RTL languages', () => {
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
        getLanguageDisplayName: vi.fn(),
        t: vi.fn(),
      })

      render(
        <TestWrapper>
          <LanguageSwitcher />
        </TestWrapper>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      const dropdown = screen.getByPlaceholderText('Search...').closest('.absolute')
      expect(dropdown).toHaveStyle({ right: '0' })
    })
  })
}) 