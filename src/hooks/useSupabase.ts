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
            worker:workers(name),
            route_jobs(
              id,
              job_order,
              route:routes(id, route_date, status, worker:workers(name))
            )
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

  return { jobs, loading, error, refetch: () => setLoading(true) }
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

// Authentication is now handled by AuthContext (src/contexts/AuthContext.tsx)
// Use: import { useAuth } from '@/contexts/AuthContext'

// Routes hooks
export function useWorkerRoutes(workerId: string, date?: string) {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRoutes() {
      try {
        let query = supabase
          .from('routes')
          .select(`
            *,
            route_jobs(
              id,
              job_order,
              location_lat,
              location_lng,
              completed_at,
              job:jobs(id, title, address, latitude, longitude)
            )
          `)
          .eq('worker_id', workerId)
          .order('route_date', { ascending: false })

        if (date) {
          query = query.eq('route_date', date)
        }

        const { data, error } = await query

        if (error) throw error
        setRoutes(data || [])
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (workerId) {
      fetchRoutes()
    }
  }, [workerId, date])

  return { routes, loading, error }
}

export function useRoute(routeId: string) {
  const [route, setRoute] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchRoute() {
      try {
        const { data, error } = await supabase
          .from('routes')
          .select(`
            *,
            worker:workers(id, name),
            route_jobs(
              id,
              job_order,
              location_lat,
              location_lng,
              completed_at,
              job:jobs(id, title, address, latitude, longitude, description)
            )
          `)
          .eq('id', routeId)
          .single()

        if (error) throw error
        setRoute(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (routeId) {
      fetchRoute()
    }
  }, [routeId])

  return { route, loading, error }
}

// Fetch all workers who have routes for a given date
export function useWorkersWithRoutes(date?: string) {
  const [workersWithRoutes, setWorkersWithRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchWorkersWithRoutes() {
      try {
        let query = supabase
          .from('routes')
          .select(`
            id,
            route_date,
            status,
            total_distance_meters,
            total_duration_seconds,
            optimized_path,
            worker_id,
            worker:workers(id, name, email),
            route_jobs(id, job_order, location_lat, location_lng)
          `)
          .order('created_at', { ascending: false })

        if (date) {
          query = query.eq('route_date', date)
        }

        const { data, error } = await query

        if (error) throw error
        
        // Transform data to include job count
        const transformed = (data || []).map(route => ({
          ...route,
          jobCount: route.route_jobs?.length || 0
        }))
        
        setWorkersWithRoutes(transformed)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkersWithRoutes()
  }, [date])

  return { workersWithRoutes, loading, error }
}

