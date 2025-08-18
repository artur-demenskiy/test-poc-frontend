import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Auth } from '../components/Auth'
import { UserProfile } from '../components/UserProfile'
import { DataManager } from '../components/DataManager'
import { AuthProvider } from '../contexts/AuthContext'

// Mock Supabase
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => ({ data: null, error: null }))
        }))
      })),
      insert: vi.fn(() => ({ select: vi.fn(() => ({ data: null, error: null })) })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ select: vi.fn(() => ({ data: null, error: null })) })) })),
      delete: vi.fn(() => ({ eq: vi.fn(() => ({ data: null, error: null })) })),
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
      }))
    })),
  }
}))

// Mock hooks
vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}))

vi.mock('../hooks/useDatabase', () => ({
  useDatabase: vi.fn()
}))

describe('Supabase Components', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Auth Component', () => {
    it('renders sign in form by default', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        loading: false,
        error: null
      })

      render(<Auth />)
      
      expect(screen.getByText('Sign In')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
      expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument()
    })

    it('switches to sign up mode', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        loading: false,
        error: null
      })

      render(<Auth />)
      
      fireEvent.click(screen.getByText("Don't have an account? Sign up"))
      
      expect(screen.getByText('Sign Up')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
    })

    it('switches to reset password mode', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        loading: false,
        error: null
      })

      render(<Auth />)
      
      fireEvent.click(screen.getByText('Forgot your password?'))
      
      expect(screen.getByText('Reset Password')).toBeInTheDocument()
      expect(screen.getByText('Send Reset Link')).toBeInTheDocument()
    })

    it('shows loading state', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        loading: true,
        error: null
      })

      render(<Auth />)
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows error message', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        signIn: vi.fn(),
        signUp: vi.fn(),
        resetPassword: vi.fn(),
        loading: false,
        error: { message: 'Invalid credentials' }
      })

      render(<Auth />)
      
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  describe('UserProfile Component', () => {
    it('renders user profile when authenticated', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        user: {
          id: '123',
          email: 'test@example.com',
          created_at: '2023-01-01T00:00:00Z',
          last_sign_in_at: '2023-01-02T00:00:00Z'
        },
        signOut: vi.fn(),
        loading: false
      })

      render(<UserProfile />)
      
      expect(screen.getByText('User Profile')).toBeInTheDocument()
      expect(screen.getByText('test@example.com')).toBeInTheDocument()
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    it('shows loading state', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        user: null,
        signOut: vi.fn(),
        loading: true
      })

      render(<UserProfile />)
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('returns null when not authenticated', () => {
      const mockUseAuth = vi.mocked(require('../hooks/useAuth').useAuth)
      mockUseAuth.mockReturnValue({
        user: null,
        signOut: vi.fn(),
        loading: false
      })

      const { container } = render(<UserProfile />)
      
      expect(container.firstChild).toBeNull()
    })
  })

  describe('DataManager Component', () => {
    it('renders data manager with table selection', () => {
      const mockUseDatabase = vi.mocked(require('../hooks/useDatabase').useDatabase)
      mockUseDatabase.mockReturnValue({
        data: [],
        loading: false,
        error: null,
        fetchData: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
      })

      render(<DataManager />)
      
      expect(screen.getByText('Data Manager')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter table name')).toBeInTheDocument()
      expect(screen.getByText('Create New Item')).toBeInTheDocument()
    })

    it('shows loading state', () => {
      const mockUseDatabase = vi.mocked(require('../hooks/useDatabase').useDatabase)
      mockUseDatabase.mockReturnValue({
        data: null,
        loading: true,
        error: null,
        fetchData: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
      })

      render(<DataManager />)
      
      expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })

    it('shows error message', () => {
      const mockUseDatabase = vi.mocked(require('../hooks/useDatabase').useDatabase)
      mockUseDatabase.mockReturnValue({
        data: null,
        loading: false,
        error: { message: 'Database error' },
        fetchData: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
      })

      render(<DataManager />)
      
      expect(screen.getByText('Database error')).toBeInTheDocument()
    })

    it('displays data in table', () => {
      const mockData = [
        {
          id: '1',
          name: 'Test Item',
          description: 'Test Description',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        }
      ]

      const mockUseDatabase = vi.mocked(require('../hooks/useDatabase').useDatabase)
      mockUseDatabase.mockReturnValue({
        data: mockData,
        loading: false,
        error: null,
        fetchData: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
        subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
      })

      render(<DataManager />)
      
      expect(screen.getByText('Test Item')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })
})

describe('AuthContext', () => {
  it('provides auth context to children', () => {
    const TestComponent = () => {
      const { user } = require('../contexts/AuthContext').useAuthContext()
      return <div data-testid="user">{user ? user.email : 'No user'}</div>
    }

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('user')).toBeInTheDocument()
  })

  it('throws error when used outside provider', () => {
    const TestComponent = () => {
      const { user } = require('../contexts/AuthContext').useAuthContext()
      return <div>{user?.email}</div>
    }

    expect(() => render(<TestComponent />)).toThrow(
      'useAuthContext must be used within an AuthProvider'
    )
  })
}) 