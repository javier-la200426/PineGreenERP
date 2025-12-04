import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import MobileBottomNav from '@/components/MobileBottomNav'
import Button from '@/components/Button'
import RouteMap, { RouteData } from '@/components/RouteMap'
import { useWorkerRoutes, useWorkersWithRoutes } from '@/hooks/useSupabase'

export default function WorkerRouteView() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  // Fetch all workers with routes for today
  const { workersWithRoutes, loading: workersLoading } = useWorkersWithRoutes(today)
  
  // State for selected worker
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Set initial worker when data loads
  useEffect(() => {
    if (workersWithRoutes.length > 0 && !selectedWorkerId) {
      // Select first worker with jobs
      const workerWithJobs = workersWithRoutes.find(r => r.jobCount > 0)
      if (workerWithJobs) {
        setSelectedWorkerId(workerWithJobs.worker_id)
      }
    }
  }, [workersWithRoutes, selectedWorkerId])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch routes for selected worker
  const { routes, loading, error } = useWorkerRoutes(selectedWorkerId || '', today)
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  // Get current worker info
  const currentWorkerRoute = workersWithRoutes.find(r => r.worker_id === selectedWorkerId)
  const currentWorkerName = currentWorkerRoute?.worker?.name || 'Select Worker'

  useEffect(() => {
    if (routes && routes.length > 0) {
      setSelectedRoute(routes[0])
    } else {
      setSelectedRoute(null)
    }
  }, [routes])

  const navItems = [
    { to: '/worker/jobs', icon: 'calendar_today', label: 'Today' },
    { to: '/worker/route', icon: 'event_note', label: 'Schedule' },
    { to: '/settings', icon: 'person', label: 'Profile' },
  ]

  // Convert route data to RouteData format for the map
  const routeForMap: RouteData[] = selectedRoute
    ? [
        {
          workerId: selectedRoute.worker_id,
          workerName: currentWorkerName,
          path: selectedRoute.optimized_path || [],
          jobs:
            selectedRoute.route_jobs?.map((rj: any) => ({
              jobId: rj.job.id,
              jobName: rj.job.title,
              location: [rj.location_lat, rj.location_lng],
              order: rj.job_order,
            })) || [],
          color: '#3B82F6',
        },
      ]
    : []

  const totalJobs = selectedRoute?.route_jobs?.length || 0
  const completedJobs =
    selectedRoute?.route_jobs?.filter((rj: any) => rj.completed_at)?.length || 0
  const distanceKm = selectedRoute
    ? (selectedRoute.total_distance_meters / 1000).toFixed(1)
    : '0'
  const durationMin = selectedRoute
    ? Math.round(selectedRoute.total_duration_seconds / 60)
    : 0

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden">
      {/* Top Nav Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200/10 dark:border-white/10 p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3 text-gray-800 dark:text-white">
          <Icon name="route" className="text-primary text-2xl" />
          <div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              {t('worker.route.title')}
            </h2>
            {selectedWorkerId && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {currentWorkerName}
              </p>
            )}
          </div>
        </div>
        
        {/* Worker Selector Menu */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center size-10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10"
          >
            <Icon name="more_vert" />
          </button>
          
          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Switch Worker
                </p>
              </div>
              
              {workersLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : workersWithRoutes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                  No workers with routes today
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {workersWithRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => {
                        setSelectedWorkerId(route.worker_id)
                        setIsMenuOpen(false)
                      }}
                      className={`w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        selectedWorkerId === route.worker_id 
                          ? 'bg-primary/10 dark:bg-primary/20' 
                          : ''
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${
                        selectedWorkerId === route.worker_id 
                          ? 'bg-primary' 
                          : 'bg-gray-400 dark:bg-gray-600'
                      }`}>
                        {route.worker?.name?.charAt(0) || '?'}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`font-medium ${
                          selectedWorkerId === route.worker_id 
                            ? 'text-primary' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {route.worker?.name || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {route.jobCount} {route.jobCount === 1 ? 'job' : 'jobs'} assigned
                        </p>
                      </div>
                      {selectedWorkerId === route.worker_id && (
                        <Icon name="check_circle" className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="flex-grow pb-24 p-4">
        <div className="flex flex-col gap-6">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading route...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <Icon name="error" className="text-red-500 text-6xl mb-4" />
              <p className="text-gray-900 dark:text-white text-lg mb-2">
                Error loading route
              </p>
              <p className="text-gray-500 dark:text-gray-400">{error.message}</p>
            </div>
          )}

          {/* No Route State */}
          {!loading && !error && !selectedRoute && (
            <div className="text-center py-12">
              <Icon name="route" className="text-gray-400 text-6xl mb-4" />
              <p className="text-gray-900 dark:text-white text-lg mb-2">
                No Route Assigned
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                You don't have any routes assigned for today. Check back later or contact
                your manager.
              </p>
            </div>
          )}

          {/* Route Display */}
          {!loading && !error && selectedRoute && (
            <>
              {/* Header */}
              <div>
                <h1 className="text-gray-900 dark:text-white text-2xl font-black leading-tight tracking-[-0.033em] mb-2">
                  {currentWorkerName}'s Route
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {new Date(selectedRoute.route_date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Jobs</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {completedJobs}/{totalJobs}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Distance
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {distanceKm} km
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Duration
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {durationMin} min
                  </p>
                </div>
              </div>

              {/* Map */}
              <div className="w-full h-80 bg-gray-800 rounded-xl overflow-hidden">
                <RouteMap routes={routeForMap} zoom={13} />
              </div>

              {/* Job List */}
              <div className="bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Stops ({totalJobs})
                </h3>
                <div className="space-y-3">
                  {selectedRoute.route_jobs
                    ?.sort((a: any, b: any) => a.job_order - b.job_order)
                    .map((routeJob: any) => (
                      <div
                        key={routeJob.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          routeJob.completed_at
                            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                            routeJob.completed_at
                              ? 'bg-green-500 text-white'
                              : 'bg-blue-500 text-white'
                          }`}
                        >
                          {routeJob.job_order}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {routeJob.job.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {routeJob.job.address || 'No address'}
                          </p>
                          {routeJob.completed_at && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              ✓ Completed
                            </p>
                          )}
                        </div>
                        {!routeJob.completed_at && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              // TODO: Navigate to job completion or open maps
                              const lat = routeJob.location_lat
                              const lng = routeJob.location_lng
                              window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                                '_blank'
                              )
                            }}
                          >
                            <Icon name="navigation" className="text-sm" />
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Action Button */}
              {completedJobs < totalJobs && (
                <Button variant="primary" size="lg" fullWidth>
                  <Icon name="play_arrow" className="mr-2" />
                  Start Route
                </Button>
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <MobileBottomNav items={navItems} />
    </div>
  )
}
