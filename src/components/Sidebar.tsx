import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Icon from './Icon'

interface SidebarLink {
  to: string
  icon: string
  label: string
  filled?: boolean
}

interface SidebarProps {
  links: SidebarLink[]
  bottomLinks?: SidebarLink[]
  userRole?: 'manager' | 'worker' | 'client'
  onLogout?: () => void
}

export default function Sidebar({ links, bottomLinks, onLogout }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0c141b] p-4 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 p-2">
          <Icon name="task_alt" className="text-primary text-3xl" />
          <h1 className="text-white text-xl font-bold">{t('common.jobsite')}</h1>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col gap-2 mt-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive(link.to)
                  ? 'bg-primary/20 text-primary'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <Icon name={link.icon} filled={link.filled && isActive(link.to)} />
              <p className="text-sm font-medium leading-normal">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Links */}
      {bottomLinks && (
        <div className="flex flex-col gap-1">
          {bottomLinks.map((link) =>
            link.icon === 'logout' && onLogout ? (
              <button
                key="logout"
                onClick={onLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 transition-colors w-full text-left"
              >
                <Icon name={link.icon} />
                <p className="text-sm font-medium leading-normal">{link.label}</p>
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
              >
                <Icon name={link.icon} />
                <p className="text-sm font-medium leading-normal">{link.label}</p>
              </Link>
            )
          )}
        </div>
      )}
    </aside>
  )
}

