import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/store/themeStore'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function Settings() {
  const { t, i18n } = useTranslation()
  const { isDarkMode, toggleTheme } = useThemeStore()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('language', lng)
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Icon name="arrow_back" />
            </button>
            <div>
              <h1 className="text-gray-900 dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                {t('settings.title')}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                {t('settings.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Settings */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">
              {t('settings.language')}
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {t('settings.selectLanguage')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                    i18n.language === 'en'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
                  }`}
                >
                  <Icon name={i18n.language === 'en' ? 'check_circle' : 'language'} />
                  <span className="font-medium">{t('settings.english')}</span>
                </button>
                <button
                  onClick={() => changeLanguage('es')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 transition-colors ${
                    i18n.language === 'es'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary'
                  }`}
                >
                  <Icon name={i18n.language === 'es' ? 'check_circle' : 'language'} />
                  <span className="font-medium">{t('settings.spanish')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">
              {t('settings.theme')}
            </h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name={isDarkMode ? 'dark_mode' : 'light_mode'} className="text-2xl" />
                <div>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {isDarkMode ? t('settings.darkMode') : t('settings.lightMode')}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notifications Settings */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">
              {t('settings.notifications')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="email" className="text-xl" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {t('settings.emailNotifications')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Receive updates via email
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/50"
                  defaultChecked
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="notifications" className="text-xl" />
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {t('settings.pushNotifications')}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Receive push notifications
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  className="form-checkbox h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/50"
                  defaultChecked
                />
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">
              {t('settings.account')}
            </h2>
            <div className="space-y-3">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Icon name="person" className="mr-3" />
                {t('settings.profile')}
              </Button>
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Icon name="lock" className="mr-3" />
                {t('settings.changePassword')}
              </Button>
              <Button variant="danger" size="md" fullWidth className="justify-start">
                <Icon name="logout" className="mr-3" />
                {t('settings.logout')}
              </Button>
            </div>
          </div>

          {/* Supabase Connection Status */}
          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight mb-4">
              Database Connection
            </h2>
            <div className="flex items-center gap-3">
              <Icon name="cloud" className="text-2xl text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-white font-medium">Supabase</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Not configured - Add your credentials in .env file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

