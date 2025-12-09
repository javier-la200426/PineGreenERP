import { useState } from 'react'
import { supabase } from '@/lib/supabase'

// Backend API configuration
const API_BASE_URL = import.meta.env.VITE_ROUTE_OPTIMIZER_API_URL || 'http://localhost:5001'

interface Job {
  id: string
  address?: string
  latitude?: number
  longitude?: number
}

interface Worker {
  id: string
  name: string
  depot_address?: string
  depot_lat?: number
  depot_lng?: number
}

interface OptimizedRoute {
  worker_id: string
  worker_name: string
  jobs: Array<{
    job_id: string
    order: number
    location: [number, number]
  }>
  total_duration_seconds: number
  total_distance_meters: number
  optimized_path: Array<[number, number]>
}

interface OptimizeRoutesResponse {
  success: boolean
  routes: Record<string, OptimizedRoute>
  metadata?: {
    num_jobs: number
    num_workers: number
  }
  warnings?: any[]
  error?: string
}

export function useRouteOptimization() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  /**
   * Call the backend API to optimize routes
   */
  const optimizeRoutes = async (jobs: Job[], workers: Worker[], routeDate: string) => {
    setLoading(true)
    setError(null)

    try {
      // Call backend API
      const response = await fetch(`${API_BASE_URL}/api/optimize-routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jobs, workers }),
      })

      const data: OptimizeRoutesResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to optimize routes')
      }

      // Save routes to Supabase
      const savedRoutes = await saveRoutesToDatabase(data.routes, routeDate)

      return {
        routes: data.routes,
        savedRoutes,
        warnings: data.warnings || [],
      }
    } catch (err) {
      const error = err as Error
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Geocode an address using the backend API
   */
  const geocodeAddresses = async (addresses: string[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresses }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to geocode addresses')
      }

      return data.coordinates
    } catch (err) {
      console.error('Geocoding error:', err)
      throw err
    }
  }

  /**
   * Save optimized routes to Supabase database
   */
  const saveRoutesToDatabase = async (
    routes: Record<string, OptimizedRoute>,
    routeDate: string
  ) => {
    const savedRoutes = []
    const workerIds = Object.values(routes).map(r => r.worker_id)

    // First, delete existing routes for these workers on this date
    console.log(`[SAVE] Deleting existing routes for ${workerIds.length} workers on ${routeDate}`)
    
    for (const workerId of workerIds) {
      // Get existing route for this worker/date
      const { data: existingRoute } = await supabase
        .from('routes')
        .select('id')
        .eq('worker_id', workerId)
        .eq('route_date', routeDate)
        .single()

      if (existingRoute) {
        // Delete route_jobs first (foreign key constraint)
        await supabase
          .from('route_jobs')
          .delete()
          .eq('route_id', existingRoute.id)

        // Clear route_id from jobs
        await supabase
          .from('jobs')
          .update({ route_id: null, route_order: null })
          .eq('route_id', existingRoute.id)

        // Delete the route
        await supabase
          .from('routes')
          .delete()
          .eq('id', existingRoute.id)

        console.log(`[SAVE] Deleted existing route ${existingRoute.id} for worker ${workerId}`)
      }
    }

    // Now create new routes
    for (const [workerId, routeData] of Object.entries(routes)) {
      try {
        // 1. Insert route record
        const { data: route, error: routeError } = await supabase
          .from('routes')
          .insert({
            route_date: routeDate,
            worker_id: routeData.worker_id,
            status: 'pending',
            total_distance_meters: routeData.total_distance_meters,
            total_duration_seconds: routeData.total_duration_seconds,
            optimized_path: routeData.optimized_path,
          })
          .select()
          .single()

        if (routeError) throw routeError

        // 2. Insert route_jobs records
        const routeJobs = routeData.jobs.map((job) => ({
          route_id: route.id,
          job_id: job.job_id,
          job_order: job.order,
          location_lat: job.location[0],
          location_lng: job.location[1],
        }))

        const { error: jobsError } = await supabase.from('route_jobs').insert(routeJobs)

        if (jobsError) throw jobsError

        // 3. Update jobs table with route_id and route_order
        for (const job of routeData.jobs) {
          const { error: updateError } = await supabase
            .from('jobs')
            .update({
              route_id: route.id,
              route_order: job.order,
            })
            .eq('id', job.job_id)

          if (updateError) throw updateError
        }

        savedRoutes.push(route)
      } catch (err) {
        console.error(`Error saving route for worker ${workerId}:`, err)
        throw err
      }
    }

    return savedRoutes
  }

  return {
    optimizeRoutes,
    geocodeAddresses,
    loading,
    error,
  }
}

/**
 * Hook to fetch routes from database
 */
export function useRoutes(filters?: { workerId?: string; date?: string; status?: string }) {
  const [routes, setRoutes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchRoutes = async () => {
    try {
      let query = supabase.from('routes').select(`
        *,
        worker:workers(id, name),
        route_jobs(
          id,
          job_order,
          location_lat,
          location_lng,
          completed_at,
          job:jobs(id, title, address)
        )
      `)

      if (filters?.workerId) {
        query = query.eq('worker_id', filters.workerId)
      }

      if (filters?.date) {
        query = query.eq('route_date', filters.date)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query.order('route_date', { ascending: false })

      if (error) throw error

      setRoutes(data || [])
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  return { routes, loading, error, refetch: fetchRoutes }
}
