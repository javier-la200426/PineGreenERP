import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import StatCard from '@/components/StatCard'
import Icon from '@/components/Icon'

export default function ManagerDashboard() {
  const { t } = useTranslation()

  const sidebarLinks = [
    { to: '/manager/dashboard', icon: 'dashboard', label: t('common.dashboard'), filled: true },
    { to: '/manager/jobs', icon: 'work', label: t('common.jobs') },
    { to: '/manager/workers', icon: 'group', label: t('common.workers') },
    { to: '/manager/clients', icon: 'business_center', label: t('common.clients') },
    { to: '/manager/reports', icon: 'assessment', label: t('common.reports') },
  ]

  const bottomLinks = [
    { to: '/settings', icon: 'settings', label: t('common.settings') },
    { to: '/login', icon: 'logout', label: t('common.logout') },
  ]

  // Mock data for workers
  const workers = [
    {
      id: 1,
      name: 'John Doe',
      status: 'available',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
    {
      id: 2,
      name: 'Mike Williams',
      status: 'on_route',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
    {
      id: 3,
      name: 'Jane Smith',
      status: 'busy',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-[#50E3C2]'
      case 'on_route':
        return 'bg-[#F5A623]'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return t('manager.dashboard.available')
      case 'on_route':
        return t('manager.dashboard.onRoute')
      case 'busy':
        return t('manager.dashboard.busy')
      default:
        return status
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Header
            title={t('manager.dashboard.title')}
            subtitle={t('manager.dashboard.subtitle')}
          />

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title={t('manager.dashboard.totalRevenue')}
              value="$12,450"
              change="+5.2%"
              changeType="positive"
            />
            <StatCard
              title={t('manager.dashboard.pendingInvoices')}
              value="18"
              change="+2.1%"
              changeType="positive"
            />
            <StatCard
              title={t('manager.dashboard.jobsCompletedToday')}
              value="32"
              change="-1.5%"
              changeType="negative"
            />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main column */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              {/* Job Scheduler Form */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  {t('manager.dashboard.scheduleNewJob')}
                </h2>
                <div className="bg-[#0c141b] border border-[#324d67] rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <label className="flex flex-col">
                      <p className="text-white/80 text-sm font-medium leading-normal pb-2">
                        Client Name
                      </p>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-primary h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                        placeholder="Select a client"
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-white/80 text-sm font-medium leading-normal pb-2">
                        Job Address
                      </p>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-primary h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                        placeholder="Enter job location"
                      />
                    </label>
                    <label className="flex flex-col">
                      <p className="text-white/80 text-sm font-medium leading-normal pb-2">
                        Service Type
                      </p>
                      <select className="form-select flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-primary h-12 p-3 text-sm font-normal leading-normal">
                        <option>Plumbing</option>
                        <option>Electrical</option>
                        <option>Cleaning</option>
                      </select>
                    </label>
                    <label className="flex flex-col">
                      <p className="text-white/80 text-sm font-medium leading-normal pb-2">
                        Preferred Date & Time
                      </p>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#324d67] bg-[#192633] focus:border-primary h-12 placeholder:text-gray-400 p-3 text-sm font-normal leading-normal"
                        type="datetime-local"
                      />
                    </label>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button className="bg-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#101922]">
                      Schedule Job
                    </button>
                  </div>
                </div>
              </section>

              {/* Route Monitor */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  {t('manager.dashboard.liveRouteMonitor')}
                </h2>
                <div className="bg-[#0c141b] border border-[#324d67] rounded-xl h-96 overflow-hidden flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Icon name="map" className="text-6xl mb-4" />
                    <p className="text-lg">
                      {t('worker.route.routeOptimization')}
                    </p>
                    <p className="text-sm mt-2">Map integration coming soon</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right sidebar/panel */}
            <aside className="lg:col-span-1 flex flex-col gap-8">
              {/* Worker Availability Panel */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  {t('manager.dashboard.workerStatus')}
                </h2>
                <div className="bg-[#0c141b] border border-[#324d67] rounded-xl p-6 flex flex-col gap-4">
                  {workers.map((worker) => (
                    <div key={worker.id} className="flex items-center gap-4">
                      <img
                        className="size-12 rounded-full object-cover"
                        src={worker.avatar}
                        alt={worker.name}
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{worker.name}</p>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${getStatusColor(worker.status)}`}></span>
                          <p className={`text-xs ${getStatusColor(worker.status).replace('bg-', 'text-')}`}>
                            {getStatusText(worker.status)}
                          </p>
                        </div>
                      </div>
                      <button className="text-white/60 hover:text-white">
                        <Icon name="more_vert" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* System Status Panel */}
              <section>
                <h2 className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-4">
                  {t('manager.dashboard.systemStatus')}
                </h2>
                <div className="bg-[#0c141b] border border-[#324d67] rounded-xl p-6 flex flex-col gap-5">
                  <div className="flex justify-between items-center">
                    <p className="text-white/80">{t('manager.dashboard.language')}</p>
                    <p className="text-white font-medium">English (US)</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80">{t('manager.dashboard.timezone')}</p>
                    <p className="text-white font-medium">PST (UTC-8)</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80">{t('manager.dashboard.apiHealth')}</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#50E3C2]"></span>
                      <p className="text-[#50E3C2] text-sm">{t('manager.dashboard.normal')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-white/80">{t('manager.dashboard.databaseStatus')}</p>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#50E3C2]"></span>
                      <p className="text-[#50E3C2] text-sm">{t('manager.dashboard.connected')}</p>
                    </div>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

