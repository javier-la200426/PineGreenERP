import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import MobileBottomNav from '@/components/MobileBottomNav'

export default function WorkerJobList() {
  const { t } = useTranslation()

  const jobs = [
    {
      id: 4,
      title: 'AC Unit Inspection',
      time: '1:00 PM - 2:00 PM',
      client: 'Eleanor Pena',
      address: '2118 Thornridge Cir. Syracuse, Connecticut',
      status: 'in_progress',
    },
    {
      id: 5,
      title: 'Plumbing Fixture Repair',
      time: '2:30 PM - 3:30 PM',
      client: 'Cody Fisher',
      address: '4517 Washington Ave. Manchester, Kentucky',
      status: 'pending',
    },
    {
      id: 3,
      title: 'Furnace Maintenance',
      time: '11:00 AM - 12:00 PM',
      client: 'Jane Cooper',
      address: '2972 Westheimer Rd. Santa Ana, Illinois',
      status: 'completed',
    },
  ]

  const getStatusBadge = (status: string) => {
    const styles = {
      in_progress: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      pending: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      completed: 'bg-green-500/20 text-green-600 dark:text-green-400',
    }

    const labels = {
      in_progress: 'In Progress',
      pending: 'Pending',
      completed: 'Completed',
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

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

      <main className="flex-grow pb-24">
        {/* Page Heading */}
        <div className="flex flex-col gap-3 p-4">
          <p className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
            Tuesday, Oct 26
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
            {t('worker.jobList.jobsCompleted')}: 3/8
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 px-4 pb-4">
          <div className="rounded-full bg-gray-200 dark:bg-gray-700/50">
            <div className="h-2 rounded-full bg-primary" style={{ width: '37.5%' }}></div>
          </div>
        </div>

        {/* Map */}
        <div className="px-4 py-2">
          <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover flex items-center justify-center bg-gray-800">
            <div className="text-center text-gray-400">
              <Icon name="map" className="text-4xl mb-2" />
              <p className="text-sm">Map view coming soon</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <h2 className="text-gray-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          {t('worker.jobList.title')}
        </h2>

        {/* Job List */}
        <div className="flex flex-col gap-3 px-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`flex flex-col gap-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 bg-white dark:bg-gray-800/20 p-4 ${
                job.status === 'completed' ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">{getStatusBadge(job.status)}</div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">#{job.id}</p>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{job.time}</p>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="person" className="text-lg text-gray-500 dark:text-gray-400 mt-0.5" />
                <div className="flex flex-col">
                  <p className="text-base font-medium text-gray-800 dark:text-gray-200">
                    {job.client}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{job.address}</p>
                </div>
              </div>
              {job.status === 'in_progress' && (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary/90">
                  <Icon name="navigation" />
                  {t('worker.jobList.startNavigation')}
                </button>
              )}
              {job.status === 'pending' && (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 py-3 text-base font-semibold text-gray-800 dark:text-white shadow-sm transition-colors hover:bg-gray-300 dark:hover:bg-gray-600">
                  {t('worker.jobList.viewDetails')}
                </button>
              )}
              {job.status === 'completed' && (
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 py-3 text-base font-semibold text-gray-800 dark:text-white shadow-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                  {t('worker.jobList.viewReport')}
                </button>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <MobileBottomNav items={navItems} />
    </div>
  )
}

