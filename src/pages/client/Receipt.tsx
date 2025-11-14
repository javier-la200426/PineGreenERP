import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function ClientReceipt() {
  const { t } = useTranslation()

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center">
      <div className="flex h-full w-full max-w-4xl grow flex-col px-4 py-8 md:py-12">
        <header className="flex w-full items-center justify-between border-b border-solid border-zinc-200 dark:border-zinc-800 px-6 py-4">
          <div className="flex items-center gap-4 text-zinc-900 dark:text-white">
            <Icon name="task_alt" className="text-primary text-2xl" />
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">
              {t('common.jobsite')}
            </h2>
          </div>
        </header>

        <main className="flex w-full flex-1 flex-col items-center justify-center pt-8">
          <div className="flex flex-col items-center gap-6 p-8 max-w-2xl">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/20">
              <Icon name="check_circle" className="text-green-500 text-6xl fill" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-zinc-900 dark:text-white mb-2">
                {t('client.receipt.title')}
              </h1>
              <p className="text-base font-normal leading-normal text-zinc-500 dark:text-zinc-400">
                {t('client.receipt.subtitle')}
              </p>
            </div>

            <div className="w-full bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Receipt #</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  JS2024-001
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Amount Paid</span>
                <span className="text-lg font-bold text-zinc-900 dark:text-white">$150.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Payment Method</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  •••• 4242
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-500 dark:text-zinc-400">Date</span>
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button variant="primary" size="md" fullWidth>
                <Icon name="download" className="mr-2" />
                {t('client.receipt.downloadReceipt')}
              </Button>
              <Button variant="secondary" size="md" fullWidth>
                <Icon name="print" className="mr-2" />
                {t('client.receipt.printReceipt')}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

