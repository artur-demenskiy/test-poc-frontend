import { useState } from 'react'
import { PostgrestError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Tables, Inserts, Updates, Database } from '../types/supabase'

interface DatabaseState<T extends keyof Database['public']['Tables']> {
  data: Tables<T>[] | null
  loading: boolean
  error: PostgrestError | null
}

export function useDatabase<T extends keyof Database['public']['Tables']>(table: T) {
  const [state, setState] = useState<DatabaseState<T>>({
    data: null,
    loading: false,
    error: null
  })

  const fetchData = async (query?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      let queryBuilder = supabase.from(table).select('*')
      
      if (query) {
        queryBuilder = queryBuilder.textSearch('name', query)
      }
      
      const { data, error } = await queryBuilder
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }))
        return { error }
      }

      setState({ data, loading: false, error: null })
      return { data }
    } catch (error) {
      const dbError = error as PostgrestError
      setState(prev => ({ ...prev, error: dbError, loading: false }))
      return { error: dbError }
    }
  }

  const insert = async (values: Inserts<T>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase
        .from(table)
        .insert(values)
        .select()
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }))
        return { error }
      }

      // Refresh data after insert
      await fetchData()
      return { data }
    } catch (error) {
      const dbError = error as PostgrestError
      setState(prev => ({ ...prev, error: dbError, loading: false }))
      return { error: dbError }
    }
  }

  const update = async (id: string | number, values: Updates<T>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { data, error } = await supabase
        .from(table)
        .update(values)
        .eq('id', id)
        .select()
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }))
        return { error }
      }

      // Refresh data after update
      await fetchData()
      return { data }
    } catch (error) {
      const dbError = error as PostgrestError
      setState(prev => ({ ...prev, error: dbError, loading: false }))
      return { error: dbError }
    }
  }

  const remove = async (id: string | number) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      
      if (error) {
        setState(prev => ({ ...prev, error, loading: false }))
        return { error }
      }

      // Refresh data after delete
      await fetchData()
      return { data: null }
    } catch (error) {
      const dbError = error as PostgrestError
      setState(prev => ({ ...prev, error: dbError, loading: false }))
      return { error: dbError }
    }
  }

  const subscribe = (callback: (payload: any) => void) => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  return {
    ...state,
    fetchData,
    insert,
    update,
    remove,
    subscribe
  }
} 