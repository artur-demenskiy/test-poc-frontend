import { supabase } from '../lib/supabase'
import { PostgrestError } from '@supabase/supabase-js'

// Utility function to handle Supabase errors
export function handleSupabaseError(error: PostgrestError | null): string | null {
  if (!error) return null
  
  // Common error messages
  const errorMessages: Record<string, string> = {
    'JWT expired': 'Your session has expired. Please sign in again.',
    'Invalid JWT': 'Invalid session. Please sign in again.',
    'new row violates row-level security policy': 'You do not have permission to perform this action.',
    'duplicate key value violates unique constraint': 'This item already exists.',
    'column "id" does not exist': 'Database schema error. Please contact support.',
    'relation "items" does not exist': 'Database table not found. Please run the setup script.',
  }
  
  // Check for specific error messages
  for (const [key, message] of Object.entries(errorMessages)) {
    if (error.message.includes(key)) {
      return message
    }
  }
  
  // Return generic error message
  return error.message || 'An unexpected error occurred.'
}

// Utility function to format database timestamps
export function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return 'Never'
  
  try {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid date'
  }
}

// Utility function to validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Utility function to validate password strength
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Utility function to debounce function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Utility function to generate a random ID (for client-side use)
export function generateClientId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Utility function to check if user has specific role
export async function checkUserRole(role: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false
    
    // You can implement role checking logic here
    // For example, check user metadata or a separate roles table
    return user.user_metadata?.role === role || false
  } catch {
    return false
  }
}

// Utility function to get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Utility function to update user profile
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Utility function to handle file uploads
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: any; error: any }> {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// Utility function to get file URL
export function getFileUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
} 