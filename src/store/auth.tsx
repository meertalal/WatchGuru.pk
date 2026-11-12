import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { AdminAccount } from '../types'
import {
  ApiError,
  clearAdminToken,
  getAdminToken,
  request,
  setAdminToken,
} from '../lib/api'

interface LoginResponse {
  token: string
  expiresAt: string
  account: AdminAccount
}

export type AuthResult = { ok: true } | { ok: false; error: string }

export interface AuthContextValue {
  /** The signed-in store admin, or null for guests. */
  account: AdminAccount | null
  isAdmin: boolean
  /** True while a persisted token is being verified. */
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AdminAccount | null>(null)
  // Only start in the loading state when there is a token to verify.
  const [loading, setLoading] = useState(() => Boolean(getAdminToken()))

  useEffect(() => {
    if (!getAdminToken()) {
      setLoading(false)
      return
    }

    let cancelled = false

    request<AdminAccount>('/auth/me', { auth: true })
      .then((resolved) => {
        if (!cancelled) setAccount(resolved)
      })
      .catch((error: unknown) => {
        if (cancelled) return
        // An expired or revoked token should not keep the UI in limbo.
        if (error instanceof ApiError && error.status === 401) clearAdminToken()
        setAccount(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      try {
        const resolved = await request<LoginResponse>('/auth/login', {
          method: 'POST',
          body: { email, password },
        })

        setAdminToken(resolved.token)
        setAccount(resolved.account)
        return { ok: true }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : 'Unable to sign in right now. Please try again.'
        return { ok: false, error: message }
      }
    },
    [],
  )

  const logout = useCallback(() => {
    // Fire-and-forget revocation; the local token is cleared immediately so
    // the admin UI never waits on the network to sign out.
    void request('/auth/logout', { method: 'POST', auth: true }).catch(() => {})
    clearAdminToken()
    setAccount(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      isAdmin: account?.role === 'admin',
      loading,
      login,
      logout,
    }),
    [account, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
