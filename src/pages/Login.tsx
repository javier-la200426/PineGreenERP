import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Icon from '@/components/Icon'
import Button from '@/components/Button'

export default function Login() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Icon name="task_alt" className="text-primary text-4xl" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('common.jobsite')}
            </h1>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('login.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{t('login.subtitle')}</p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                className="form-input w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                className="form-input w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary/50"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('login.rememberMe')}
                </span>
              </label>
              <a href="#" className="text-sm text-primary hover:underline">
                {t('login.forgotPassword')}
              </a>
            </div>

            <Link to="/manager/dashboard">
              <Button variant="primary" size="lg" fullWidth>
                {t('login.signIn')}
              </Button>
            </Link>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800/50 text-gray-500 dark:text-gray-400">
                or
              </span>
            </div>
          </div>

          {/* Quick Access Links */}
          <div className="space-y-3">
            <Link to="/manager/dashboard">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Icon name="dashboard" className="mr-3" />
                Manager Dashboard
              </Button>
            </Link>
            <Link to="/worker/jobs">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Icon name="work" className="mr-3" />
                Worker Dashboard
              </Button>
            </Link>
            <Link to="/client/appointment">
              <Button variant="secondary" size="md" fullWidth className="justify-start">
                <Icon name="person" className="mr-3" />
                Client Portal
              </Button>
            </Link>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            {t('login.dontHaveAccount')}{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              {t('login.signUp')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

