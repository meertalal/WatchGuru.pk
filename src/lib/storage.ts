/**
 * Safe, namespaced JSON persistence on top of localStorage.
 *
 * Every repository goes through these helpers so that storage can be
 * swapped (or disabled, e.g. in private mode) without touching call sites.
 * Keys are always prefixed with `watchguru-pk:` and versioned by the
 * caller (`...:v1`) so schema changes can invalidate old payloads.
 */

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const PREFIX = 'watchguru-pk:'

export const storageKeys = {
  catalog: `${PREFIX}catalog:v1`,
  orders: `${PREFIX}orders:v1`,
  ordersSeeded: `${PREFIX}orders:seeded:v1`,
  accounts: `${PREFIX}accounts:v1`,
  session: `${PREFIX}session:v1`,
} as const

/** Returns a working storage or `null` when persistence is unavailable. */
export function defaultStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    const probe = `${PREFIX}probe`
    window.localStorage.setItem(probe, '1')
    window.localStorage.removeItem(probe)
    return window.localStorage
  } catch {
    return null
  }
}

export function readJson<T>(storage: StorageLike | null, key: string, fallback: T): T {
  if (!storage) return fallback
  try {
    const raw = storage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson(storage: StorageLike | null, key: string, value: unknown): boolean {
  if (!storage) return false
  try {
    storage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeKey(storage: StorageLike | null, key: string): void {
  if (!storage) return
  try {
    storage.removeItem(key)
  } catch {
    /* storage unavailable — nothing to remove */
  }
}
