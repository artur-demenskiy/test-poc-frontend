// Supabase Database Types
// These types represent the structure of your database tables

export interface Database {
  public: {
    Tables: {
      items: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          user_id?: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string | null
        }
      }
      // Add more tables here as needed
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience types for common operations
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types
export type Item = Tables<'items'>
export type ItemInsert = Inserts<'items'>
export type ItemUpdate = Updates<'items'>

export type Profile = Tables<'profiles'>
export type ProfileInsert = Inserts<'profiles'>
export type ProfileUpdate = Updates<'profiles'>

// Auth types (re-exported from Supabase)
export type { User, Session, AuthError } from '@supabase/supabase-js' 