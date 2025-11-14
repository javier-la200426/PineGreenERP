import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function ClientAppointment() {
  const { t } = useTranslation()

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-zinc-200 dark:border-zinc-800 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-4">
          <div className="flex items-center gap-4 text-zinc-900 dark:text-white">
            <Icon name="task_alt" className="text-primary text-2xl" />
            <h2 className="text-xl font-bold leading-tight tracking-tight">{t('common.jobsite')}</h2>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/settings">
              <Button variant="primary" size="md">
                <span className="truncate">{t('client.appointment.myAccount')}</span>
              </Button>
            </Link>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop")',
              }}
            ></div>
          </div>
        </header>

        <main className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 flex flex-1 justify-center py-10 sm:py-16">
          <div className="layout-content-container flex flex-col w-full max-w-4xl flex-1 gap-8">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-zinc-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                  {t('client.appointment.title')}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 text-base font-normal leading-normal">
                  {t('client.appointment.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col items-stretch justify-start lg:flex-row lg:items-start gap-6">
                  <div
                    className="w-full lg:w-1/3 bg-center bg-no-repeat aspect-video lg:aspect-square bg-cover rounded-lg"
                    style={{
                      backgroundImage:
                        'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop")',
                    }}
                  ></div>
                  <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-green-500/20 px-4">
                        <p className="text-green-500 text-sm font-medium leading-normal">
                          {t('client.appointment.confirmed')}
                        </p>
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">
                        {t('client.appointment.jobId')}: #JS-83721
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                        Full Home Cleaning Service
                      </p>
                      <p className="text-zinc-500 dark:text-zinc-400 text-base font-normal leading-normal mt-1">
                        A thorough clean of your entire home, including all rooms, bathrooms, and
                        kitchen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-4 border-t border-solid border-zinc-200 dark:border-zinc-800">
                <div className="flex gap-4 border-b border-solid border-zinc-200 dark:border-zinc-800 py-4">
                  <Icon name="calendar_month" className="text-primary mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">
                      {t('client.appointment.dateTime')}
                    </p>
                    <p className="text-zinc-900 dark:text-white text-sm font-normal leading-normal">
                      Tuesday, October 26, 2024 at 10:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 border-b border-solid border-zinc-200 dark:border-zinc-800 py-4">
                  <Icon name="location_on" className="text-primary mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">
                      {t('client.appointment.serviceAddress')}
                    </p>
                    <p className="text-zinc-900 dark:text-white text-sm font-normal leading-normal">
                      123 Main Street, Anytown, USA 12345
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 border-b border-solid border-zinc-200 dark:border-zinc-800 sm:border-b-0 py-4">
                  <Icon name="badge" className="text-primary mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">
                      {t('client.appointment.assignedWorker')}
                    </p>
                    <p className="text-zinc-900 dark:text-white text-sm font-normal leading-normal">
                      John Doe
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 py-4">
                  <Icon name="tag" className="text-primary mt-1" />
                  <div className="flex flex-col gap-1">
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-normal leading-normal">
                      {t('client.appointment.referenceNumber')}
                    </p>
                    <p className="text-zinc-900 dark:text-white text-sm font-normal leading-normal">
                      JS-83721
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row-reverse items-center gap-4 p-6 border-t border-solid border-zinc-200 dark:border-zinc-800">
                <Button variant="primary" size="md" fullWidth className="sm:w-auto">
                  <span className="truncate">{t('client.appointment.reschedule')}</span>
                </Button>
                <Button variant="ghost" size="md" fullWidth className="sm:w-auto">
                  <span className="truncate">{t('client.appointment.cancelAppointment')}</span>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

