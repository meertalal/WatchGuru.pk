import { useEffect, useRef, useState } from 'react'

/**
 * A typed, JSON-serialised localStorage state hook.
 * Falls back gracefully when storage is unavailable (private mode, quota, SSR).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const isFirstRun = useRef(true)
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage full or unavailable: ignore */
    }
  }, [key, value])

  return [value, setValue] as const
}
