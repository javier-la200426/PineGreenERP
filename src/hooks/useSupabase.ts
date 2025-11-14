import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Custom hook for Supabase queries
 * TODO: Implement actual data fetching logic once Supabase is configured
 */

export function useJobs() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchJobs() {
      try {
        const { data, error } = await supabase
          .from('jobs')
          .select(`
            *,
            client:clients(name, company),
            worker:workers(name)
          `)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setJobs(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  return { jobs, loading, error }
}

export function useClients() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setClients(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, loading, error }
}

export function useWorkers() {
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchWorkers() {
      try {
        const { data, error } = await supabase
          .from('workers')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        setWorkers(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkers()
  }, [])

  return { workers, loading, error }
}

// Authentication hooks
export function useAuth() {
  const [user] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Implement actual auth logic
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   setUser(session?.user ?? null)
    //   setLoading(false)
    // })

    // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setUser(session?.user ?? null)
    // })

    // return () => subscription.unsubscribe()
    
    setLoading(false)
  }, [])

  return { user, loading }
}

