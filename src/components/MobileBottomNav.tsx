import { Link, useLocation } from 'react-router-dom'
import Icon from './Icon'

interface NavItem {
  to: string
  icon: string
  label: string
}

interface MobileBottomNavProps {
  items: NavItem[]
}

export default function MobileBottomNav({ items }: MobileBottomNavProps) {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 mx-auto max-w-md border-t border-gray-200/50 dark:border-gray-700/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-around px-4">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center gap-1 ${
              isActive(item.to)
                ? 'text-primary'
                : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary'
            }`}
          >
            <Icon name={item.icon} />
            <span className={`text-xs ${isActive(item.to) ? 'font-semibold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

