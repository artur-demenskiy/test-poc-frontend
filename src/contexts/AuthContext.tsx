import { User, Session, AuthError } from '@supabase/supabase-js'
import { createContext, useContext, ReactNode } from 'react'

import { useAuth } from '../hooks/useAuth'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
  signIn: (email: string, password: string) => Promise<{ data?: unknown; error?: AuthError }>
  signUp: (email: string, password: string) => Promise<{ data?: unknown; error?: AuthError }>
  signOut: () => Promise<{ data?: unknown; error?: AuthError }>
  resetPassword: (email: string) => Promise<{ data?: unknown; error?: AuthError }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 