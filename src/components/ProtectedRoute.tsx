import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

function getDefaultRoute(role: UserRole): string {
  switch (role) {
    case 'manager': return '/manager/dashboard'
    case 'worker': return '/worker/jobs'
    case 'client': return '/client/appointment'
  }
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { session, profile, isLoading } = useAuth()

  // Still determining auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Session exists but profile hasn't loaded yet — wait for it
  if (!profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!allowedRoles.includes(profile.role)) {
    return <Navigate to={getDefaultRoute(profile.role)} replace />
  }

  return <>{children}</>
}

export function RoleBasedRedirect() {
  const { session, profile, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  // Session exists but profile hasn't loaded yet
  if (!profile) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return <Navigate to={getDefaultRoute(profile.role)} replace />
}
