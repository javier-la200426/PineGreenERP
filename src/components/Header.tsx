import { useTranslation } from 'react-i18next'
import Icon from './Icon'

interface HeaderProps {
  title: string
  subtitle?: string
  showSearch?: boolean
  showNotifications?: boolean
  showProfile?: boolean
}

export default function Header({
  title,
  subtitle,
  showSearch = true,
  showNotifications = true,
  showProfile = true,
}: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div className="flex min-w-72 flex-col gap-2">
        <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-400 text-base font-normal leading-normal">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="form-input w-64 rounded-lg border border-[#324d67] bg-[#192633] py-2 pl-10 pr-4 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
              placeholder={t('common.search')}
              type="text"
            />
          </div>
        )}

        {showNotifications && (
          <button className="relative rounded-full p-2 text-white/80 hover:bg-white/10">
            <Icon name="notifications" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-[#101922]"></span>
          </button>
        )}

        {showProfile && (
          <div className="flex items-center gap-3">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop")',
              }}
            ></div>
            <div className="flex flex-col">
              <p className="text-white text-sm font-medium leading-normal">Alex Grim</p>
              <p className="text-gray-400 text-xs font-normal leading-normal">
                manager@jobsite.com
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

