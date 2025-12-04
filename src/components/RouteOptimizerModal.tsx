import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'
import Button from './Button'
import RouteMap, { RouteData } from './RouteMap'
import { useRouteOptimization } from '@/hooks/useRouteOptimization'

interface RouteOptimizerModalProps {
  isOpen: boolean
  onClose: () => void
  availableJobs: any[]
  availableWorkers: any[]
  onOptimizationComplete?: () => void
}

export default function RouteOptimizerModal({
  isOpen,
  onClose,
  availableJobs,
  availableWorkers,
  onOptimizationComplete,
}: RouteOptimizerModalProps) {
  const { t } = useTranslation()
  const { optimizeRoutes, loading, error } = useRouteOptimization()

  const [selectedJobIds, setSelectedJobIds] = useState<string[]>([])
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([])
  const [routeDate, setRouteDate] = useState(new Date().toISOString().split('T')[0])
  const [optimizationResult, setOptimizationResult] = useState<any>(null)
  const [step, setStep] = useState<'selection' | 'preview' | 'success'>('selection')

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setStep('selection')
      setSelectedJobIds([])
      setSelectedWorkerIds([])
      setOptimizationResult(null)
    }
  }, [isOpen])

  const toggleJobSelection = (jobId: string) => {
    setSelectedJobIds((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  const toggleWorkerSelection = (workerId: string) => {
    setSelectedWorkerIds((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    )
  }

  const handleOptimize = async () => {
    try {
      // Prepare jobs data
      const jobs = availableJobs
        .filter((job) => selectedJobIds.includes(job.id))
        .map((job) => ({
          id: job.id,
          address: job.address,
          latitude: job.latitude,
          longitude: job.longitude,
        }))

      // Prepare workers data
      const workers = availableWorkers
        .filter((worker) => selectedWorkerIds.includes(worker.id))
        .map((worker) => ({
          id: worker.id,
          name: worker.name,
          depot_address: worker.depot_address,
          depot_lat: worker.depot_latitude,
          depot_lng: worker.depot_longitude,
        }))

      // Call optimization API
      const result = await optimizeRoutes(jobs, workers, routeDate)

      setOptimizationResult(result)
      setStep('preview')
    } catch (err) {
      console.error('Optimization failed:', err)
    }
  }

  const handleSaveAndClose = () => {
    if (onOptimizationComplete) {
      onOptimizationComplete()
    }
    onClose()
  }

  // Convert optimization result to RouteData format for map
  const routesForMap: RouteData[] = optimizationResult
    ? Object.values(optimizationResult.routes).map((route: any) => ({
        workerId: route.worker_id,
        workerName: route.worker_name,
        path: route.optimized_path,
        jobs: route.jobs.map((job: any) => ({
          jobId: job.job_id,
          jobName: availableJobs.find((j) => j.id === job.job_id)?.title || '',
          location: job.location,
          order: job.order,
        })),
      }))
    : []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {step === 'selection' && 'Optimize Routes'}
              {step === 'preview' && 'Route Optimization Preview'}
              {step === 'success' && 'Routes Optimized Successfully'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {step === 'selection' &&
                'Select jobs and workers to create optimized routes'}
              {step === 'preview' && 'Review and save optimized routes'}
              {step === 'success' && 'Routes have been saved to database'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Selection */}
          {step === 'selection' && (
            <div className="space-y-6">
              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Route Date
                </label>
                <input
                  type="date"
                  value={routeDate}
                  onChange={(e) => setRouteDate(e.target.value)}
                  className="form-input w-full max-w-xs rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              {/* Workers Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Select Workers ({selectedWorkerIds.length} selected)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {availableWorkers.map((worker) => (
                    <label
                      key={worker.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedWorkerIds.includes(worker.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedWorkerIds.includes(worker.id)}
                        onChange={() => toggleWorkerSelection(worker.id)}
                        className="form-checkbox rounded text-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {worker.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {worker.email || 'No email'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Jobs Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Select Jobs ({selectedJobIds.length} selected)
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableJobs.map((job) => (
                    <label
                      key={job.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedJobIds.includes(job.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedJobIds.includes(job.id)}
                        onChange={() => toggleJobSelection(job.id)}
                        className="form-checkbox rounded text-primary"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {job.title || job.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {job.address || 'No address'}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Preview */}
          {step === 'preview' && optimizationResult && (
            <div className="space-y-6">
              {/* Map */}
              <div className="h-96">
                <RouteMap routes={routesForMap} />
              </div>

              {/* Route Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(optimizationResult.routes).map((route: any) => (
                  <div
                    key={route.worker_id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      {route.worker_name}
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <p>Jobs: {route.jobs.length}</p>
                      <p>
                        Distance: {(route.total_distance_meters / 1000).toFixed(1)} km
                      </p>
                      <p>
                        Duration: {Math.round(route.total_duration_seconds / 60)} min
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          {step === 'selection' && (
            <Button
              variant="primary"
              onClick={handleOptimize}
              disabled={
                loading ||
                selectedJobIds.length === 0 ||
                selectedWorkerIds.length === 0
              }
            >
              {loading ? (
                <>
                  <Icon name="autorenew" className="animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Icon name="route" />
                  Optimize Routes
                </>
              )}
            </Button>
          )}

          {step === 'preview' && (
            <Button variant="primary" onClick={handleSaveAndClose}>
              <Icon name="check_circle" />
              Save Routes
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
