import { useState, FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import Icon from '@/components/Icon'
import Button from '@/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/supabase'

function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'manager': return '/manager/dashboard'
    case 'worker': return '/worker/jobs'
    case 'client': return '/client/appointment'
  }
}

export default function Login() {
  const { t } = useTranslation()
  const { session, profile, isLoading, signIn, signUp } = useAuth()

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  // Redirect if already authenticated
  if (!isLoading && session && profile) {
    return <Navigate to={getDefaultRoute(profile.role)} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    if (activeTab === 'signin') {
      const result = await signIn(email, password)
      if (result.error) {
        setError(t('login.invalidCredentials'))
      }
    } else {
      const result = await signUp(email, password, fullName)
      if (result.error) {
        setError(result.error)
      } else {
        setSignUpSuccess(true)
      }
    }

    setSubmitting(false)
  }

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

          {/* Tab Switcher */}
          <div className="flex mb-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(null); setSignUpSuccess(false) }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'signin'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('login.signInTab')}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('signup'); setError(null); setSignUpSuccess(false) }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'signup'
                  ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {t('login.signUpTab')}
            </button>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {activeTab === 'signin' ? t('login.title') : t('login.signUpTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'signin' ? t('login.subtitle') : t('login.signUpSubtitle')}
            </p>
          </div>

          {/* Success Message */}
          {signUpSuccess && (
            <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
              {t('login.signUpSuccess')}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {t('login.fullName')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="form-input w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                {t('login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {activeTab === 'signin' && (
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
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={submitting}
            >
              {submitting
                ? t('common.loading')
                : activeTab === 'signin'
                  ? t('login.signIn')
                  : t('login.signUp')
              }
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
            {activeTab === 'signin' ? (
              <>
                {t('login.dontHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(null) }}
                  className="text-primary hover:underline font-medium"
                >
                  {t('login.signUp')}
                </button>
              </>
            ) : (
              <>
                {t('login.alreadyHaveAccount')}{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('signin'); setError(null) }}
                  className="text-primary hover:underline font-medium"
                >
                  {t('login.signIn')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
