import { useState, useEffect } from 'react'
import Icon from './Icon'
import RouteMap, { RouteData } from './RouteMap'
import { useWorkersWithRoutes } from '@/hooks/useSupabase'

interface RoutesViewerModalProps {
  isOpen: boolean
  onClose: () => void
}

// Color palette for multiple routes
const ROUTE_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
]

export default function RoutesViewerModal({ isOpen, onClose }: RoutesViewerModalProps) {
  const today = new Date().toISOString().split('T')[0]
  const { workersWithRoutes, loading: loadingWorkers } = useWorkersWithRoutes(today)
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)

  // Filter to only workers with jobs and create consistent color map
  const workersWithJobs = workersWithRoutes.filter(wr => wr.jobCount > 0)
  
  // Create a color map based on worker_id for consistency
  const colorMap: Record<string, string> = {}
  workersWithJobs.forEach((wr, index) => {
    colorMap[wr.worker_id] = ROUTE_COLORS[index % ROUTE_COLORS.length]
  })

  // Auto-select first worker with jobs
  useEffect(() => {
    if (workersWithJobs.length > 0 && !selectedWorkerId) {
      setSelectedWorkerId(workersWithJobs[0].worker_id)
    }
  }, [workersWithJobs, selectedWorkerId])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#0c141b] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Today's Routes</h2>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Icon name="close" className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {loadingWorkers ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-400">Loading routes...</p>
            </div>
          ) : workersWithJobs.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="route" className="text-gray-500 text-6xl mb-4" />
              <p className="text-white text-lg mb-2">No Routes Today</p>
              <p className="text-gray-400">
                Use "Optimize Routes" to create routes for workers.
              </p>
            </div>
          ) : (
            <>
              {/* Map */}
              <div className="h-80 rounded-xl overflow-hidden mb-6 border border-gray-700">
                <FullRoutesMap workersWithRoutes={workersWithJobs} colorMap={colorMap} />
              </div>

              {/* Workers Summary - only show workers with jobs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workersWithJobs.map((wr) => (
                  <WorkerRouteCard 
                    key={wr.id} 
                    workerRoute={wr} 
                    color={colorMap[wr.worker_id]}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// Component that fetches full route data and displays the map
function FullRoutesMap({ workersWithRoutes, colorMap }: { workersWithRoutes: any[]; colorMap: Record<string, string> }) {
  const [routeData, setRouteData] = useState<RouteData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFullRoutes() {
      const { supabase } = await import('@/lib/supabase')
      
      const routeIds = workersWithRoutes.map(wr => wr.id)

      if (routeIds.length === 0) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('routes')
        .select(`
          id,
          worker_id,
          optimized_path,
          worker:workers(name),
          route_jobs(
            job_order,
            location_lat,
            location_lng,
            job:jobs(id, title)
          )
        `)
        .in('id', routeIds)

      if (error) {
        console.error('Error fetching routes:', error)
        setLoading(false)
        return
      }

      // Use the colorMap to ensure consistent colors with worker cards
      const routes: RouteData[] = (data || []).map((route) => ({
        workerId: route.worker_id,
        workerName: route.worker?.name || 'Unknown',
        path: route.optimized_path || [],
        jobs: (route.route_jobs || [])
          .sort((a: any, b: any) => a.job_order - b.job_order)
          .map((rj: any) => ({
            jobId: rj.job?.id,
            jobName: rj.job?.title || 'Unknown',
            location: [rj.location_lat, rj.location_lng],
            order: rj.job_order,
          })),
        color: colorMap[route.worker_id] || ROUTE_COLORS[0],
      }))

      setRouteData(routes)
      setLoading(false)
    }

    fetchFullRoutes()
  }, [workersWithRoutes, colorMap])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <RouteMap routes={routeData} zoom={12} />
}

// Worker route card component
function WorkerRouteCard({ workerRoute, color }: { workerRoute: any; color: string }) {
  const distanceKm = workerRoute.total_distance_meters 
    ? (parseFloat(workerRoute.total_distance_meters) / 1000).toFixed(1) 
    : '0'
  const durationMin = workerRoute.total_duration_seconds 
    ? Math.round(workerRoute.total_duration_seconds / 60) 
    : 0

  return (
    <div 
      className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
      style={{ borderLeftColor: color, borderLeftWidth: '4px' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {workerRoute.worker?.name?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="text-white font-semibold">{workerRoute.worker?.name || 'Unknown'}</h3>
          <p className="text-gray-400 text-sm">{workerRoute.worker?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-2xl font-bold text-white">{workerRoute.jobCount}</p>
          <p className="text-xs text-gray-400">Jobs</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-2xl font-bold text-white">{distanceKm}</p>
          <p className="text-xs text-gray-400">km</p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-2xl font-bold text-white">{durationMin}</p>
          <p className="text-xs text-gray-400">min</p>
        </div>
      </div>
    </div>
  )
}

