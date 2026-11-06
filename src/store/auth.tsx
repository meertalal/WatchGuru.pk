import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CustomerAccount, ProfilePatch } from '../types'
import {
  accountRepository,
  type AccountRepository,
  type RegisterInput,
} from '../data/repositories/accountRepository'
import { storageKeys, readJson, removeKey, writeJson, defaultStorage } from '../lib/storage'

interface Session {
  accountId: string
  signedInAt: string
}

export type AuthResult = { ok: true } | { ok: false; error: string }

export interface AuthContextValue {
  /** Null while the persisted session is being resolved. */
  account: CustomerAccount | null
  isAdmin: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  register: (input: RegisterInput) => Promise<AuthResult>
  logout: () => void
  updateProfile: (patch: ProfilePatch) => Promise<boolean>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}

export function AuthProvider({
  children,
  repository = accountRepository,
}: {
  children: ReactNode
  repository?: AccountRepository
}) {
  const [account, setAccount] = useState<CustomerAccount | null>(null)
  // Only start in the loading state when there is actually a session to resolve.
  const [loading, setLoading] = useState(() => {
    const storage = defaultStorage()
    const session = readJson<Session | null>(storage, storageKeys.session, null)
    return Boolean(session?.accountId)
  })

  // Resolve any persisted session exactly once on mount.
  useEffect(() => {
    const storage = defaultStorage()
    const session = readJson<Session | null>(storage, storageKeys.session, null)
    if (!session?.accountId) return
    let cancelled = false
    repository
      .getById(session.accountId)
      .then((resolved) => {
        if (cancelled) return
        if (resolved) setAccount(resolved)
        else removeKey(storage, storageKeys.session)
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [repository])

  const persistSession = useCallback((next: Session | null) => {
    const storage = defaultStorage()
    if (next) writeJson(storage, storageKeys.session, next)
    else removeKey(storage, storageKeys.session)
  }, [])

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      const resolved = await repository.authenticate(email, password)
      if (!resolved) return { ok: false, error: 'Incorrect email or password. Please try again.' }
      setAccount(resolved)
      persistSession({ accountId: resolved.id, signedInAt: new Date().toISOString() })
      return { ok: true }
    },
    [repository, persistSession],
  )

  const register = useCallback(
    async (input: RegisterInput): Promise<AuthResult> => {
      const result = await repository.register(input)
      if (!result.ok) {
        return result.error === 'EMAIL_TAKEN'
          ? { ok: false, error: 'An account with this email already exists. Try signing in instead.' }
          : { ok: false, error: 'Please check your details and try again.' }
      }
      setAccount(result.account)
      persistSession({ accountId: result.account.id, signedInAt: new Date().toISOString() })
      return { ok: true }
    },
    [repository, persistSession],
  )

  const logout = useCallback(() => {
    setAccount(null)
    persistSession(null)
  }, [persistSession])

  const updateProfile = useCallback(
    async (patch: ProfilePatch): Promise<boolean> => {
      if (!account) return false
      const updated = await repository.updateProfile(account.id, patch)
      if (!updated) return false
      setAccount(updated)
      return true
    },
    [account, repository],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      account,
      isAdmin: account?.role === 'admin',
      loading,
      login,
      register,
      logout,
      updateProfile,
    }),
    [account, loading, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
