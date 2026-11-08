import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../store'

/**
 * Route guard for the store admin. Redirects anonymous visitors and
 * non-admin customers to sign in, remembering where they were headed.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-ash">
        Verifying store credentials…
      </div>
    )
  }
  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}
