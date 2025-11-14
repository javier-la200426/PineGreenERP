import { useTranslation } from 'react-i18next'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function ManagerWorkers() {
  const { t } = useTranslation()

  const sidebarLinks = [
    { to: '/manager/dashboard', icon: 'dashboard', label: t('common.dashboard') },
    { to: '/manager/jobs', icon: 'work', label: t('common.jobs') },
    { to: '/manager/workers', icon: 'group', label: t('common.workers'), filled: true },
    { to: '/manager/clients', icon: 'business_center', label: t('common.clients') },
    { to: '/manager/reports', icon: 'assessment', label: t('common.reports') },
  ]

  const bottomLinks = [
    { to: '/settings', icon: 'settings', label: t('common.settings') },
    { to: '/login', icon: 'logout', label: t('common.logout') },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <Header
            title={t('manager.workers.title')}
            subtitle={t('manager.workers.subtitle')}
          />

          <div className="flex items-center justify-center h-96">
            <p className="text-gray-400 text-lg">
              {t('manager.workers.title')} page - Coming soon
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

