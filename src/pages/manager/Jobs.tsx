import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Icon from '@/components/Icon'
import { useJobs } from '@/hooks/useSupabase'

export default function ManagerJobs() {
  const { t } = useTranslation()
  const { jobs: jobsData, loading, error } = useJobs()

  const sidebarLinks = [
    { to: '/manager/dashboard', icon: 'dashboard', label: t('common.dashboard') },
    { to: '/manager/jobs', icon: 'work', label: t('common.jobs'), filled: true },
    { to: '/manager/workers', icon: 'group', label: t('common.workers') },
    { to: '/manager/clients', icon: 'business_center', label: t('common.clients') },
    { to: '/manager/reports', icon: 'assessment', label: t('common.reports') },
  ]

  const bottomLinks = [
    { to: '/settings', icon: 'settings', label: t('common.settings') },
    { to: '/login', icon: 'logout', label: t('common.logout') },
  ]

  // Transform Supabase data to match component format
  const jobs = jobsData.map((job: any) => ({
    id: job.id,
    name: job.title,
    client: job.client?.company || job.client?.name || 'N/A',
    worker: job.worker?.name || 'Unassigned',
    dueDate: job.scheduled_date ? new Date(job.scheduled_date).toISOString().split('T')[0] : 'N/A',
    status: job.status,
  }))

  const getStatusBadge = (status: string) => {
    const styles = {
      in_progress: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
      completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
      pending: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      overdue: 'bg-red-500/10 text-red-600 dark:text-red-400',
    }

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        <span className={`size-1.5 rounded-full ${status === 'in_progress' ? 'bg-yellow-500' : status === 'completed' ? 'bg-green-500' : status === 'pending' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
        {t(`manager.jobs.${status}`)}
      </span>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-white text-lg">{t('common.loading')}</p>
          </div>
        </main>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <div className="text-center">
            <Icon name="error" className="text-red-500 text-6xl mb-4" />
            <p className="text-white text-lg mb-2">Error loading jobs</p>
            <p className="text-gray-400">{error.message}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-white text-3xl font-bold leading-tight tracking-tight">
                {t('manager.jobs.title')}
              </h1>
              <p className="text-gray-400 text-base font-normal leading-normal">
                {t('manager.jobs.subtitle')} ({jobs.length} jobs)
              </p>
            </div>
            <button className="flex items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide shadow-sm hover:bg-primary/90">
              <Icon name="add_circle" />
              <span className="truncate">{t('manager.jobs.createNewJob')}</span>
            </button>
          </div>

          {/* Toolbar & Filters */}
          <div className="p-4 bg-[#111a22] rounded-xl border border-[#324d67] mb-6">
            <div className="mb-4">
              <div className="flex w-full items-stretch rounded-lg h-12 bg-[#233648]">
                <div className="text-gray-400 flex items-center justify-center pl-4">
                  <Icon name="search" />
                </div>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-400 px-2 text-base font-normal leading-normal"
                  placeholder={t('manager.jobs.searchPlaceholder')}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#233648] px-3 text-white hover:bg-gray-700">
                <Icon name="label" />
                <p className="text-sm font-medium leading-normal">{t('manager.jobs.statusAll')}</p>
                <Icon name="arrow_drop_down" />
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#233648] px-3 text-white hover:bg-gray-700">
                <Icon name="person" />
                <p className="text-sm font-medium leading-normal">{t('manager.jobs.worker')}</p>
                <Icon name="arrow_drop_down" />
              </button>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-[#233648] px-3 text-white hover:bg-gray-700">
                <Icon name="calendar_today" />
                <p className="text-sm font-medium leading-normal">{t('manager.jobs.dueDate')}</p>
                <Icon name="arrow_drop_down" />
              </button>
              <div className="flex-grow"></div>
              <button className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg px-3 text-gray-400 hover:bg-[#233648]">
                <Icon name="refresh" />
                <p className="text-sm font-medium leading-normal">{t('manager.jobs.reset')}</p>
              </button>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto bg-[#111a22] rounded-xl border border-[#324d67]">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-800/50">
                <tr>
                  <th className="p-4 w-4">
                    <input
                      className="form-checkbox rounded border-gray-600 bg-gray-900 text-primary focus:ring-primary/50"
                      type="checkbox"
                    />
                  </th>
                  <th className="px-6 py-3">{t('manager.jobs.job')}</th>
                  <th className="px-6 py-3">{t('manager.jobs.client')}</th>
                  <th className="px-6 py-3">{t('manager.jobs.worker')}</th>
                  <th className="px-6 py-3">{t('manager.jobs.dueDate')}</th>
                  <th className="px-6 py-3">{t('manager.jobs.status')}</th>
                  <th className="px-6 py-3">{t('manager.jobs.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="p-4 w-4">
                      <input
                        className="form-checkbox rounded border-gray-600 bg-gray-900 text-primary focus:ring-primary/50"
                        type="checkbox"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">
                      {job.name}
                    </td>
                    <td className="px-6 py-4">{job.client}</td>
                    <td className="px-6 py-4">{job.worker}</td>
                    <td className="px-6 py-4">{job.dueDate}</td>
                    <td className="px-6 py-4">{getStatusBadge(job.status)}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-primary rounded-md hover:bg-gray-700">
                        <Icon name="edit" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-primary rounded-md hover:bg-gray-700">
                        <Icon name="visibility" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-700">
                        <Icon name="delete" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

