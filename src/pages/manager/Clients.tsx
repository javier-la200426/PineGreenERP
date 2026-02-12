import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Icon from '@/components/Icon'
import { useAuth } from '@/contexts/AuthContext'

export default function ManagerClients() {
  const { t } = useTranslation()
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const sidebarLinks = [
    { to: '/manager/dashboard', icon: 'dashboard', label: t('common.dashboard') },
    { to: '/manager/jobs', icon: 'work', label: t('common.jobs') },
    { to: '/manager/workers', icon: 'group', label: t('common.workers') },
    { to: '/manager/clients', icon: 'business_center', label: t('common.clients'), filled: true },
    { to: '/manager/reports', icon: 'assessment', label: t('common.reports') },
  ]

  const bottomLinks = [
    { to: '/settings', icon: 'settings', label: t('common.settings') },
    { to: '/login', icon: 'logout', label: t('common.logout') },
  ]

  const clients = [
    {
      id: 1,
      name: 'Eleanor Vance',
      company: 'Innovate Inc.',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      clientSince: 'Jan 15, 2022',
    },
    {
      id: 2,
      name: 'Marcus Holloway',
      company: 'Tech Solutions',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      clientSince: 'Mar 22, 2022',
    },
    {
      id: 3,
      name: 'Beatrice Chen',
      company: 'Creative Minds',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      clientSince: 'Jul 8, 2021',
    },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar links={sidebarLinks} bottomLinks={bottomLinks} userRole="manager" onLogout={handleLogout} />

      <main className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-12 gap-6 p-6">
          {/* Left Column: Client List */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                    {t('manager.clients.title')}
                  </p>
                  <p className="text-gray-400 text-base font-normal leading-normal">
                    {t('manager.clients.subtitle')}
                  </p>
                </div>
                <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] gap-2">
                  <Icon name="add" />
                  <span className="truncate">{t('manager.clients.newClient')}</span>
                </button>
              </div>

              <div className="py-1">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-12">
                  <div className="text-gray-400 flex bg-[#233648] items-center justify-center pl-4 rounded-l-lg border-r-0">
                    <Icon name="search" />
                  </div>
                  <input
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-none bg-[#233648] h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    placeholder={t('manager.clients.searchPlaceholder')}
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#324d67] bg-[#111a22]">
                <table className="w-full">
                  <thead className="bg-[#192633]">
                    <tr>
                      <th className="px-4 py-3 text-left w-12">
                        <input
                          className="h-4 w-4 rounded border-[#324d67] bg-transparent text-primary focus:ring-primary/50"
                          type="checkbox"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-white text-sm font-medium leading-normal">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, index) => (
                      <tr
                        key={client.id}
                        className={`border-t border-t-[#324d67] cursor-pointer ${
                          index === 0 ? 'bg-primary/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="h-[72px] px-4 py-2 text-center">
                          <input
                            className="h-4 w-4 rounded border-[#324d67] bg-transparent text-primary focus:ring-primary/50"
                            type="checkbox"
                          />
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <div className="text-white text-sm font-medium leading-normal">
                            {client.name}
                          </div>
                          <div className="text-gray-400 text-sm font-normal">{client.company}</div>
                        </td>
                        <td className="h-[72px] px-4 py-2">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                              client.status === 'active'
                                ? 'bg-green-500/10 text-green-500 ring-green-500/20'
                                : 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
                            }`}
                          >
                            {t(`manager.clients.${client.status}`)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Client Detail */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-8">
            <div className="sticky top-6 flex flex-col gap-6">
              <div className="p-6 bg-[#111a22] rounded-xl border border-[#324d67]">
                <div className="flex w-full flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                  <div className="flex gap-4">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-24 w-24 flex-shrink-0"
                      style={{ backgroundImage: `url(${clients[0].avatar})` }}
                    ></div>
                    <div className="flex flex-col justify-center">
                      <p className="text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
                        {clients[0].name}
                      </p>
                      <p className="text-gray-400 text-base font-normal leading-normal">
                        {clients[0].company}
                      </p>
                      <p className="text-gray-400 text-base font-normal leading-normal">
                        {t('manager.clients.clientSince')} {clients[0].clientSince}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full sm:w-auto gap-3">
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#233648] text-white text-sm font-bold leading-normal tracking-[0.015em] flex-1 sm:flex-auto gap-2">
                      <Icon name="edit" />
                      <span className="truncate">{t('common.edit')}</span>
                    </button>
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-500/10 text-red-500 text-sm font-bold leading-normal tracking-[0.015em] flex-1 sm:flex-auto gap-2">
                      <Icon name="delete" />
                      <span className="truncate">{t('common.delete')}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#111a22] rounded-xl border border-[#324d67]">
                <div className="border-b border-[#324d67]">
                  <nav className="flex -mb-px px-6">
                    <a
                      className="shrink-0 border-b-2 border-primary px-1 py-4 text-sm font-medium text-primary"
                      href="#"
                    >
                      {t('manager.clients.jobHistory')}
                    </a>
                    <a
                      className="shrink-0 border-b-2 border-transparent px-4 py-4 text-sm font-medium text-gray-400 hover:border-gray-600 hover:text-gray-300"
                      href="#"
                    >
                      {t('manager.clients.billing')}
                    </a>
                    <a
                      className="shrink-0 border-b-2 border-transparent px-4 py-4 text-sm font-medium text-gray-400 hover:border-gray-600 hover:text-gray-300"
                      href="#"
                    >
                      {t('manager.clients.details')}
                    </a>
                  </nav>
                </div>

                <div className="p-6">
                  <p className="text-gray-400 text-center py-8">
                    Job history details will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

