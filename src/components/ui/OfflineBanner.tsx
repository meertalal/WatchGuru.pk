import { useEffect, useState } from 'react'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const [online, setOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (online) return null

  return (
    <aside
      role="alert"
      aria-live="assertive"
      className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto flex max-w-md items-center justify-between gap-3 border border-error/50 bg-obsidian/95 px-4 py-3 text-ivory shadow-2xl backdrop-blur sm:left-auto sm:right-6"
    >
      <div className="flex items-center gap-3">
        <WifiOff className="size-5 shrink-0 text-error" aria-hidden="true" />
        <div className="text-left">
          <p className="font-akkurat text-[9.5px] font-semibold tracking-[0.2em] text-ivory uppercase">
            No Internet Connection
          </p>
          <p className="text-[11.5px] font-light text-ash">
            Operating in offline mode. Some live actions may be unavailable.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="shrink-0 border border-gold/40 px-3 py-1 font-akkurat text-[8.5px] font-semibold tracking-[0.2em] text-gold uppercase transition-colors hover:bg-gold hover:text-obsidian"
      >
        Retry
      </button>
    </aside>
  )
}
