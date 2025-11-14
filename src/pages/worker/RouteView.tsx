import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import MobileBottomNav from '@/components/MobileBottomNav'
import Button from '@/components/Button'

export default function WorkerRouteView() {
  const { t } = useTranslation()

  const navItems = [
    { to: '/worker/jobs', icon: 'calendar_today', label: 'Today' },
    { to: '/worker/route', icon: 'event_note', label: 'Schedule' },
    { to: '/settings', icon: 'person', label: 'Profile' },
  ]

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col overflow-x-hidden">
      {/* Top Nav Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200/10 dark:border-white/10 p-4 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3 text-gray-800 dark:text-white">
          <Icon name="task_alt" className="text-primary text-2xl" />
          <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
            {t('common.jobsite')}
          </h2>
        </div>
        <button className="flex items-center justify-center size-10 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10">
          <Icon name="more_vert" />
        </button>
      </header>

      <main className="flex-grow pb-24 p-4">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em] mb-2">
              {t('worker.route.title')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Optimize your route for maximum efficiency
            </p>
          </div>

          {/* Map Placeholder */}
          <div className="w-full aspect-square bg-gray-800 rounded-xl flex items-center justify-center">
            <div className="text-center text-gray-400 p-6">
              <Icon name="route" className="text-6xl mb-4" />
              <p className="text-lg font-medium mb-2">{t('worker.route.routeOptimization')}</p>
              <p className="text-sm">
                This feature will help you plan the most efficient route between job sites
              </p>
            </div>
          </div>

          <Button variant="primary" size="lg" fullWidth>
            <Icon name="route" className="mr-2" />
            {t('worker.route.optimizeRoute')}
          </Button>

          <div className="bg-white dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Route Features (Coming Soon)
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Automatic route optimization based on job locations
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Real-time traffic updates
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Estimated travel time between jobs
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check_circle" className="text-primary mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Turn-by-turn navigation integration
                </span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <MobileBottomNav items={navItems} />
    </div>
  )
}

