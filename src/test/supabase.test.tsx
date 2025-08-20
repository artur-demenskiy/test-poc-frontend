import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock Supabase before importing components
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
  useAuth: vi.fn(() => ({
    user: null,
    session: null,
    loading: false,
    error: null,
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn()
  }))
}))

vi.mock('../hooks/useDatabase', () => ({
  useDatabase: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
    fetchData: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    subscribe: vi.fn(() => ({ unsubscribe: vi.fn() }))
  }))
}))

import { AuthProvider } from '../contexts/AuthContext'

describe('Supabase Integration', () => {
  it('renders AuthProvider without crashing', () => {
    const TestComponent = () => <div>Test</div>
    
    expect(() => 
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      )
    ).not.toThrow()
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('can render basic components', () => {
    // This test just verifies that the components can be imported and rendered
    expect(AuthProvider).toBeDefined()
  })
}) 