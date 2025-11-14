import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function WorkerJobCompletion() {
  const { t } = useTranslation()
  const { id } = useParams()

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center">
          <div className="layout-content-container flex w-full max-w-lg flex-col flex-1">
            {/* Header Bar */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-300 dark:border-gray-700 px-4 py-3 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-10">
              <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-gray-800 dark:text-white">
                <Icon name="arrow_back" />
              </button>
              <h1 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-tight">
                Job #{id} - AC Repair
              </h1>
              <div className="h-10 w-10"></div>
            </header>

            <main className="flex flex-col gap-6 p-4 pb-24">
              {/* Job Details Card */}
              <div className="flex flex-col items-stretch justify-start rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none bg-white dark:bg-gray-800 p-4">
                <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4">
                  <div>
                    <p className="text-gray-800 dark:text-white text-lg font-bold leading-tight">
                      Jane Doe
                    </p>
                    <p className="text-primary text-base font-medium leading-normal flex items-center gap-1.5 pt-1">
                      123 Main Street, Anytown, USA
                      <Icon name="open_in_new" className="text-base" />
                    </p>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                      {t('worker.jobCompletion.appointment').toUpperCase()}
                    </p>
                    <p className="text-gray-800 dark:text-white text-base font-normal leading-normal">
                      Today, 2:00 PM - 4:00 PM
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal">
                      {t('worker.jobCompletion.task').toUpperCase()}
                    </p>
                    <p className="text-gray-800 dark:text-white text-base font-normal leading-normal">
                      Annual AC unit maintenance and filter replacement.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-1 gap-3 flex-col items-stretch">
                <Button variant="primary" size="lg" fullWidth>
                  <span className="truncate">{t('worker.jobCompletion.startJob')}</span>
                </Button>
                <button className="flex h-14 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-green-500 text-white text-base font-bold leading-normal tracking-wide hover:bg-green-600">
                  <span className="truncate">{t('worker.jobCompletion.markComplete')}</span>
                </button>
              </div>

              {/* Add Job Notes */}
              <div className="flex flex-wrap items-end gap-4">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-gray-800 dark:text-white text-base font-medium leading-normal pb-2">
                    {t('worker.jobCompletion.addJobNotes')}
                  </p>
                  <textarea
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 min-h-36 p-4 text-base font-normal leading-normal placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    placeholder={t('worker.jobCompletion.notesPlaceholder')}
                  ></textarea>
                </label>
              </div>

              {/* Proof of Completion Photos */}
              <div>
                <h3 className="text-gray-800 dark:text-white text-base font-medium leading-tight pb-2">
                  {t('worker.jobCompletion.proofOfCompletion')}
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="relative group">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                      style={{
                        backgroundImage:
                          'url("https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop")',
                      }}
                    ></div>
                    <button className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>
                  <div className="relative group">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                      style={{
                        backgroundImage:
                          'url("https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=200&h=200&fit=crop")',
                      }}
                    ></div>
                    <button className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="close" className="text-base" />
                    </button>
                  </div>
                  <button className="flex aspect-square min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 text-primary flex-col gap-1">
                    <Icon name="add_a_photo" />
                    <span className="text-sm font-medium">{t('worker.jobCompletion.addPhotos')}</span>
                  </button>
                </div>
              </div>
            </main>

            {/* Sticky Footer CTA */}
            <footer className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm p-4 border-t border-gray-300 dark:border-gray-700">
              <Button variant="primary" size="lg" fullWidth>
                <span className="truncate">{t('worker.jobCompletion.submitFinish')}</span>
              </Button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

