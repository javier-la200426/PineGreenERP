import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface RouteMapProps {
  routes: RouteData[]
  center?: [number, number]
  zoom?: number
  className?: string
}

export interface RouteData {
  workerId: string
  workerName: string
  path: Array<[number, number]>
  jobs: Array<{
    jobId: string
    jobName?: string
    location: [number, number]
    order: number
  }>
  color?: string
}

// Component to auto-fit map bounds to show all routes
function AutoFitBounds({ routes }: { routes: RouteData[] }) {
  const map = useMap()

  useEffect(() => {
    if (routes.length === 0) return

    const allPoints: L.LatLngExpression[] = []

    routes.forEach((route) => {
      route.path.forEach((point) => allPoints.push(point as L.LatLngExpression))
      route.jobs.forEach((job) => allPoints.push(job.location as L.LatLngExpression))
    })

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [routes, map])

  return null
}

// Predefined colors for different routes
const ROUTE_COLORS = [
  '#EF4444', // red
  '#3B82F6', // blue
  '#10B981', // green
  '#8B5CF6', // purple
  '#F59E0B', // orange
  '#EC4899', // pink
  '#14B8A6', // teal
  '#F97316', // orange-red
]

export default function RouteMap({ routes, center, zoom = 12, className = '' }: RouteMapProps) {
  // Default center (Boston City Hall)
  const defaultCenter: [number, number] = center || [42.3601, -71.0589]

  // Filter out routes with invalid data and assign colors
  const routesWithColors = useMemo(() => {
    return routes
      .filter((route) => {
        // Filter out routes without valid jobs
        if (!route.jobs || route.jobs.length === 0) return false
        // Make sure jobs have valid locations
        return route.jobs.every(
          (job) =>
            job.location &&
            Array.isArray(job.location) &&
            job.location.length === 2 &&
            typeof job.location[0] === 'number' &&
            typeof job.location[1] === 'number'
        )
      })
      .map((route, index) => ({
        ...route,
        color: route.color || ROUTE_COLORS[index % ROUTE_COLORS.length],
        // Also filter the path to only include valid coordinates
        path: route.path.filter(
          (point) =>
            point &&
            Array.isArray(point) &&
            point.length === 2 &&
            typeof point[0] === 'number' &&
            typeof point[1] === 'number'
        ),
      }))
  }, [routes])

  // If no valid routes, show a message
  if (routesWithColors.length === 0 && routes.length > 0) {
    return (
      <div className={`relative ${className} flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-xl`} style={{ minHeight: '400px' }}>
        <p className="text-gray-500 dark:text-gray-400">No valid route data to display</p>
      </div>
    )
  }

  // Create custom numbered markers for jobs
  const createNumberedIcon = (number: number, color: string) => {
    return L.divIcon({
      className: 'custom-numbered-marker',
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 2px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="
            color: white;
            font-weight: bold;
            font-size: 14px;
            transform: rotate(45deg);
          ">${number}</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    })
  }

  return (
    <div className={`relative ${className}`}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '400px' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Auto-fit bounds to show all routes */}
        <AutoFitBounds routes={routesWithColors} />

        {/* Render routes */}
        {routesWithColors.map((route, routeIndex) => (
          <div key={`route-${route.workerId}-${routeIndex}`}>
            {/* Route polyline */}
            {route.path.length > 1 && (
              <Polyline
                positions={route.path}
                pathOptions={{
                  color: route.color,
                  weight: 4,
                  opacity: 0.7,
                }}
              />
            )}

            {/* Job markers */}
            {route.jobs.map((job) => (
              <Marker
                key={`job-${job.jobId}`}
                position={job.location}
                icon={createNumberedIcon(job.order, route.color || '#3B82F6')}
              >
                <Popup>
                  <div className="p-2">
                    <p className="font-bold text-gray-900">Stop #{job.order}</p>
                    {job.jobName && <p className="text-sm text-gray-600">{job.jobName}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Worker: {route.workerName}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </div>
        ))}
      </MapContainer>

      {/* Legend */}
      {routes.length > 0 && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-[1000] max-w-xs">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Routes</h3>
          <div className="space-y-1">
            {routesWithColors.map((route) => (
              <div key={route.workerId} className="flex items-center gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: route.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">
                  {route.workerName} ({route.jobs.length} jobs)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
