import { useTranslation } from 'react-i18next'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function ClientPayment() {
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

        <main className="flex w-full flex-1 flex-col pt-8">
          <div className="flex flex-wrap items-end justify-between gap-4 p-4">
            <div className="flex min-w-72 flex-col gap-2">
              <p className="text-3xl font-black leading-tight tracking-[-0.033em] text-zinc-900 dark:text-white md:text-4xl">
                {t('client.payment.title')} #JS2024-001
              </p>
              <p className="text-base font-normal leading-normal text-zinc-500 dark:text-zinc-400">
                {t('client.payment.subtitle')}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-200 dark:border-zinc-800 p-4">
            <div className="grid grid-cols-[1fr] gap-x-6 gap-y-5 md:grid-cols-[150px_1fr]">
              <div className="col-span-1 border-t border-t-zinc-200 py-5 md:col-span-2 md:grid md:grid-cols-subgrid dark:border-t-zinc-800">
                <p className="text-sm font-medium leading-normal text-zinc-500 dark:text-zinc-400">
                  {t('client.payment.clientName')}
                </p>
                <p className="text-sm font-normal leading-normal text-zinc-900 dark:text-white">
                  John Doe
                </p>
              </div>
              <div className="col-span-1 border-t border-t-zinc-200 py-5 md:col-span-2 md:grid md:grid-cols-subgrid dark:border-t-zinc-800">
                <p className="text-sm font-medium leading-normal text-zinc-500 dark:text-zinc-400">
                  {t('client.payment.serviceRendered')}
                </p>
                <p className="text-sm font-normal leading-normal text-zinc-900 dark:text-white">
                  Garden Maintenance - May 2024
                </p>
              </div>
              <div className="col-span-1 border-t border-t-zinc-200 py-5 md:col-span-2 md:grid md:grid-cols-subgrid dark:border-t-zinc-800">
                <p className="text-sm font-medium leading-normal text-zinc-500 dark:text-zinc-400">
                  {t('client.payment.amountDue')}
                </p>
                <p className="text-lg font-bold leading-normal text-zinc-900 dark:text-white">
                  $150.00
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full">
            <h2 className="border-t border-zinc-200 dark:border-zinc-800 px-4 pb-3 pt-8 text-xl font-bold leading-tight tracking-[-0.015em] text-zinc-900 dark:text-white md:text-[22px]">
              {t('client.payment.paymentInformation')}
            </h2>
            <div className="flex flex-col gap-6 px-4 py-3">
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-zinc-900 dark:text-white">
                  {t('client.payment.cardholderName')}
                </p>
                <input
                  className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-base font-normal leading-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter name as it appears on card"
                />
              </label>
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium leading-normal text-zinc-900 dark:text-white">
                  {t('client.payment.cardNumber')}
                </p>
                <div className="relative">
                  <input
                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 pl-10 text-base font-normal leading-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                    placeholder="0000 0000 0000 0000"
                  />
                  <Icon
                    name="credit_card"
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400"
                  />
                </div>
              </label>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <label className="flex flex-col">
                  <p className="pb-2 text-sm font-medium leading-normal text-zinc-900 dark:text-white">
                    {t('client.payment.expirationDate')}
                  </p>
                  <input
                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-base font-normal leading-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                    placeholder="MM / YY"
                  />
                </label>
                <label className="flex flex-col">
                  <div className="flex items-center gap-2 pb-2">
                    <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-white">
                      {t('client.payment.cvc')}
                    </p>
                    <Icon
                      name="help"
                      className="cursor-help text-base text-zinc-500 dark:text-zinc-400"
                    />
                  </div>
                  <input
                    className="form-input h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-3 text-base font-normal leading-normal text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20"
                    placeholder="123"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 px-4">
            <label className="flex items-center gap-3">
              <input
                className="form-checkbox h-4 w-4 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-primary focus:ring-2 focus:ring-primary/50"
                type="checkbox"
              />
              <span className="text-sm text-zinc-900 dark:text-white">
                {t('client.payment.saveCard')}
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                className="form-checkbox mt-0.5 h-4 w-4 shrink-0 rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-primary focus:ring-2 focus:ring-primary/50"
                required
                type="checkbox"
              />
              <span className="text-sm text-zinc-900 dark:text-white">
                {t('client.payment.agreeToTerms')}
              </span>
            </label>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 px-4 py-3">
            <Button variant="primary" size="lg" fullWidth className="gap-3">
              <Icon name="lock" />
              <span>{t('client.payment.paySecurely')} $150.00</span>
            </Button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t('client.payment.encryptionNotice')}
            </p>
            <div className="flex items-center gap-2 pt-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>{t('client.payment.poweredBy')}</span>
              <span className="font-bold">Stripe</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

