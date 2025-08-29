/**
 * i18n Integration Tests
 * Tests for internationalization functionality including language switching,
 * RTL support, offline persistence, and translation loading
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n'
import { useLanguage } from '@/hooks/useLanguage'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Language from '@/pages/Language'

// Mock the offline hook
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

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      {children}
    </BrowserRouter>
  </I18nextProvider>
)

describe('i18n Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default language (English)', () => {
    expect(i18n.language).toBe('en')
  })

  it('should have all required languages available', () => {
    const languages = ['en', 'ru', 'es', 'de', 'fr', 'zh', 'ja', 'ar']
    languages.forEach(lang => {
      expect(i18n.hasResourceBundle(lang, 'translation')).toBe(true)
    })
  })

  it('should detect RTL languages correctly', () => {
    expect(i18n.dir('ar')).toBe('rtl')
    expect(i18n.dir('en')).toBe('ltr')
    expect(i18n.dir('ru')).toBe('ltr')
  })

  it('should fallback to English for missing translations', () => {
    const translation = i18n.t('nonexistent.key', { defaultValue: 'Fallback Text' })
    expect(translation).toBe('Fallback Text')
  })
})

describe('useLanguage Hook', () => {
  const TestComponent: React.FC = () => {
    const languageHook = useLanguage()
    return (
      <div>
        <div data-testid="current-language">{languageHook.currentLanguage}</div>
        <div data-testid="is-rtl">{languageHook.isRTL.toString()}</div>
        <button
          data-testid="change-language"
          onClick={() => languageHook.changeLanguage('ru')}
        >
          Change to Russian
        </button>
        <button
          data-testid="auto-detect"
          onClick={() => languageHook.autoDetectLanguage()}
        >
          Auto Detect
        </button>
        <button
          data-testid="reset-language"
          onClick={() => languageHook.resetToDefaultLanguage()}
        >
          Reset
        </button>
      </div>
    )
  }

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('en')
  })

  it('should initialize with default language', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    expect(screen.getByTestId('is-rtl')).toHaveTextContent('false')
  })

  it('should change language successfully', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const changeButton = screen.getByTestId('change-language')
    fireEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('ru')
    })
  })

  it('should detect RTL for Arabic language', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // Change to Arabic
    const changeButton = screen.getByTestId('change-language')
    fireEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByTestId('is-rtl')).toHaveTextContent('true')
    })
  })

  it('should persist language preference in localStorage', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const changeButton = screen.getByTestId('change-language')
    fireEvent.click(changeButton)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'ru')
    })
  })

  it('should auto-detect browser language', async () => {
    // Mock navigator.language
    Object.defineProperty(navigator, 'language', {
      value: 'es-ES',
      configurable: true,
    })

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const autoDetectButton = screen.getByTestId('auto-detect')
    fireEvent.click(autoDetectButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('es')
    })
  })

  it('should reset to default language', async () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    // First change to Russian
    const changeButton = screen.getByTestId('change-language')
    fireEvent.click(changeButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('ru')
    })

    // Then reset to default
    const resetButton = screen.getByTestId('reset-language')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    })
  })
})

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('en')
  })

  it('should render language switcher button', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getByText('EN')).toBeInTheDocument()
  })

  it('should open dropdown on click', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument()
    expect(screen.getByText('🇷🇺 Русский')).toBeInTheDocument()
    expect(screen.getByText('🇪🇸 Español')).toBeInTheDocument()
  })

  it('should filter languages by search', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const searchInput = screen.getByPlaceholderText('Search...')
    fireEvent.change(searchInput, { target: { value: 'rus' } })

    expect(screen.getByText('🇷🇺 Русский')).toBeInTheDocument()
    expect(screen.queryByText('🇪🇸 Español')).not.toBeInTheDocument()
  })

  it('should change language on selection', async () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const russianButton = screen.getByText('🇷🇺 Русский').closest('button')
    fireEvent.click(russianButton!)

    await waitFor(() => {
      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
      expect(screen.getByText('RU')).toBeInTheDocument()
    })
  })

  it('should show RTL indicator for Arabic', () => {
    render(
      <TestWrapper>
        <LanguageSwitcher />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    const arabicButton = screen.getByText('🇸🇦 العربية').closest('button')
    expect(arabicButton).toHaveTextContent('RTL')
  })

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
})

describe('Language Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('en')
  })

  it('should render language settings page', () => {
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

  it('should show language selection options', () => {
    render(
      <TestWrapper>
        <Language />
      </TestWrapper>
    )

    expect(screen.getByText('🇷🇺 Русский')).toBeInTheDocument()
    expect(screen.getByText('🇪🇸 Español')).toBeInTheDocument()
    expect(screen.getByText('🇩🇪 Deutsch')).toBeInTheDocument()
  })

  it('should allow manual language selection', async () => {
    render(
      <TestWrapper>
        <Language />
      </TestWrapper>
    )

    const russianButton = screen.getByText('🇷🇺 Русский').closest('button')
    fireEvent.click(russianButton!)

    const applyButton = screen.getByText('Apply')
    fireEvent.click(applyButton)

    await waitFor(() => {
      expect(screen.getByText('🇷🇺')).toBeInTheDocument()
    })
  })

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

  it('should display language statistics', () => {
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
  })
})

describe('Translation Loading', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load English translations by default', () => {
    expect(i18n.t('home.title')).toBe('React TypeScript Boilerplate')
    expect(i18n.t('home.subtitle')).toContain('production-ready React application template')
  })

  it('should load Russian translations when language is changed', async () => {
    await i18n.changeLanguage('ru')
    
    expect(i18n.t('home.title')).toBe('React TypeScript Бойлерплейт')
    expect(i18n.t('home.subtitle')).toContain('готовый к продакшену React шаблон приложения')
  })

  it('should load Spanish translations when language is changed', async () => {
    await i18n.changeLanguage('es')
    
    expect(i18n.t('home.title')).toBe('React TypeScript Plantilla')
    expect(i18n.t('home.subtitle')).toContain('plantilla de aplicación React lista para producción')
  })

  it('should handle missing translations gracefully', () => {
    const translation = i18n.t('nonexistent.key', { defaultValue: 'Default Text' })
    expect(translation).toBe('Default Text')
  })

  it('should support interpolation in translations', () => {
    const translation = i18n.t('validation.minLength', { min: 8 })
    expect(translation).toBe('Minimum length is 8 characters')
  })

  it('should support pluralization', () => {
    const singular = i18n.t('time.second', { count: 1 })
    const plural = i18n.t('time.seconds', { count: 5 })
    
    expect(singular).toBe('1 second')
    expect(plural).toBe('5 seconds')
  })
})

describe('RTL Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should set document direction for RTL languages', async () => {
    await i18n.changeLanguage('ar')
    
    expect(document.documentElement.dir).toBe('rtl')
    expect(document.documentElement.lang).toBe('ar')
  })

  it('should set document direction for LTR languages', async () => {
    await i18n.changeLanguage('en')
    
    expect(document.documentElement.dir).toBe('ltr')
    expect(document.documentElement.lang).toBe('en')
  })

  it('should add RTL class to body for RTL languages', async () => {
    await i18n.changeLanguage('ar')
    
    expect(document.body.classList.contains('rtl')).toBe(true)
    expect(document.body.classList.contains('ltr')).toBe(false)
  })

  it('should add LTR class to body for LTR languages', async () => {
    await i18n.changeLanguage('en')
    
    expect(document.body.classList.contains('ltr')).toBe(true)
    expect(document.body.classList.contains('rtl')).toBe(false)
  })
})

describe('Offline Support', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue('en')
  })

  it('should persist language preference in localStorage', async () => {
    const TestComponent: React.FC = () => {
      const { changeLanguage } = useLanguage()
      return (
        <button onClick={() => changeLanguage('fr')}>
          Change to French
        </button>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('i18nextLng', 'fr')
    })
  })

  it('should attempt to cache language preference', async () => {
    const TestComponent: React.FC = () => {
      const { changeLanguage } = useLanguage()
      return (
        <button onClick={() => changeLanguage('de')}>
          Change to German
        </button>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(window.caches.open).toHaveBeenCalledWith('language-preference')
    })
  })

  it('should restore language preference from localStorage on mount', () => {
    localStorageMock.getItem.mockReturnValue('ja')
    
    const TestComponent: React.FC = () => {
      const { currentLanguage } = useLanguage()
      return <div data-testid="language">{currentLanguage}</div>
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(screen.getByTestId('language')).toHaveTextContent('ja')
  })
})

describe('Performance and Caching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should only load current language resources', () => {
    // Initially only English should be loaded
    expect(i18n.hasResourceBundle('en', 'translation')).toBe(true)
    
    // Other languages should not be loaded yet
    expect(i18n.hasResourceBundle('ru', 'translation')).toBe(false)
  })

  it('should cache language resources after loading', async () => {
    await i18n.changeLanguage('ru')
    
    // After changing language, it should be cached
    expect(i18n.hasResourceBundle('ru', 'translation')).toBe(true)
  })

  it('should handle language change errors gracefully', async () => {
    // Mock a failed language change
    const originalChangeLanguage = i18n.changeLanguage
    i18n.changeLanguage = vi.fn().mockRejectedValue(new Error('Failed to load language'))

    const TestComponent: React.FC = () => {
      const { changeLanguage, currentLanguage } = useLanguage()
      return (
        <div>
          <div data-testid="language">{currentLanguage}</div>
          <button onClick={() => changeLanguage('invalid')}>
            Change to Invalid
          </button>
        </div>
      )
    }

    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Should not crash and maintain current language
    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en')
    })

    // Restore original method
    i18n.changeLanguage = originalChangeLanguage
  })
}) 