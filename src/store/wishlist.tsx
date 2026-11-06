import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const WISHLIST_STORAGE_KEY = 'watchguru-pk:wishlist:v1'

export interface WishlistContextValue {
  ids: string[]
  count: number
  toggle: (productId: string) => void
  remove: (productId: string) => void
  has: (productId: string) => boolean
  clear: () => void
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within <WishlistProvider>')
  return ctx
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<string[]>(WISHLIST_STORAGE_KEY, [])

  const toggle = useCallback(
    (productId: string) =>
      setIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev],
      ),
    [setIds],
  )

  const remove = useCallback(
    (productId: string) => setIds((prev) => prev.filter((id) => id !== productId)),
    [setIds],
  )

  const has = useCallback((productId: string) => ids.includes(productId), [ids])
  const clear = useCallback(() => setIds([]), [setIds])

  const value = useMemo<WishlistContextValue>(
    () => ({ ids, count: ids.length, toggle, remove, has, clear }),
    [ids, toggle, remove, has, clear],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
