import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/Sidebar'
import StatCard from '@/components/StatCard'
import Icon from '@/components/Icon'

export default function ManagerReports() {
  const { t } = useTranslation()

  const sidebarLinks = [
    { to: '/manager/dashboard', icon: 'dashboard', label: t('common.dashboard') },
    { to: '/manager/jobs', icon: 'work', label: t('common.jobs') },
    { to: '/manager/workers', icon: 'group', label: t('common.workers') },
    { to: '/manager/clients', icon: 'business_center', label: t('common.clients') },
    { to: '/manager/reports', icon: 'assessment', label: t('common.reports'), filled: true },
  ]

  const bottomLinks = [
    { to: '/settings', icon: 'settings', label: t('common.settings') },
    { to: '/login', icon: 'logout', label: t('common.logout') },
  ]

  const completedJobs = [
    {
      id: 'JB-0873',
      client: 'Acme Corporation',
      worker: 'Jane Doe',
      date: 'Nov 6, 2023',
    },
    {
      id: 'JB-0872',
      client: 'Stark Industries',
      worker: 'Peter Parker',
      date: 'Nov 5, 2023',
    },
    {
      id: 'JB-0871',
      client: 'Wayne Enterprises',
      worker: 'Bruce Wayne',
      date: 'Nov 4, 2023',
    },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <div className="flex flex-col gap-3">
              <p className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                {t('manager.reports.title')}
              </p>
              <p className="text-gray-400 text-base font-normal leading-normal">
                {t('manager.reports.subtitle')}
              </p>
            </div>
            <button className="flex items-center gap-2 h-10 px-4 bg-[#1a2836] border border-[#324d67] rounded-lg text-white text-sm font-medium">
              <Icon name="calendar_month" />
              <span>Oct 5, 2023 - Nov 7, 2023</span>
              <Icon name="expand_more" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-[#324d67] gap-8">
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-primary pb-[13px] pt-4"
                href="#"
              >
                <p className="text-primary text-sm font-bold leading-normal tracking-[0.015em]">
                  {t('manager.reports.jobCompletion')}
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-400 pb-[13px] pt-4"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  {t('manager.reports.revenueAnalysis')}
                </p>
              </a>
              <a
                className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-gray-400 pb-[13px] pt-4"
                href="#"
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">
                  {t('manager.reports.workerPerformance')}
                </p>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={t('manager.reports.totalRevenue')}
              value="$125,430"
              change="+12.5%"
              changeType="positive"
            />
            <StatCard
              title={t('manager.reports.jobsCompleted')}
              value="850"
              change="+8.2%"
              changeType="positive"
            />
            <StatCard
              title={t('manager.reports.topPerformingWorker')}
              value="John Smith"
            />
            <StatCard
              title={t('manager.reports.averageJobValue')}
              value="$147.56"
              change="-1.5%"
              changeType="negative"
            />
          </div>

          {/* Completed Jobs Table */}
          <div className="bg-[#1a2836] border border-[#324d67] rounded-xl overflow-hidden">
            <div className="p-6 flex justify-between items-center border-b border-[#324d67]">
              <h3 className="text-lg font-bold text-white">{t('manager.reports.completedJobs')}</h3>
              <button className="flex items-center gap-2 h-9 px-3 bg-transparent border border-[#324d67] rounded-lg text-white text-sm font-medium">
                <Icon name="download" />
                <span>{t('manager.reports.exportToCsv')}</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800/20">
                  <tr>
                    <th className="p-4 text-sm font-semibold text-gray-400">
                      {t('manager.reports.jobId')}
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-400">
                      {t('manager.reports.clientName')}
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-400">
                      {t('manager.reports.assignedWorker')}
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-400">
                      {t('manager.reports.dateCompleted')}
                    </th>
                    <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                    <th className="p-4 text-sm font-semibold text-gray-400">
                      {t('manager.reports.proofOfCompletion')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#324d67]">
                  {completedJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-800/20">
                      <td className="p-4 text-sm text-gray-300">#{job.id}</td>
                      <td className="p-4 text-sm text-white font-medium">{job.client}</td>
                      <td className="p-4 text-sm text-gray-300">{job.worker}</td>
                      <td className="p-4 text-sm text-gray-300">{job.date}</td>
                      <td className="p-4 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          {t('manager.jobs.completed')}
                        </span>
                      </td>
                      <td className="p-4">
                        <button>
                          <div
                            className="bg-center bg-no-repeat aspect-video bg-cover rounded-lg w-24 h-14"
                            style={{
                              backgroundImage:
                                'url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=100&fit=crop")',
                            }}
                          ></div>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

