import { Link, useLocation } from 'react-router-dom'
import { Home, KeyRound, LogIn } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export function Unauthorized() {
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/admin'

  useDocumentMeta({
    title: '401 Authentication Required',
    description: 'Please authenticate to access this boutique administration service.',
    noindex: true,
  })

  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <div className="relative mb-6 flex size-28 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-36">
        <KeyRound className="size-14 text-gold/80 sm:size-18" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute -bottom-2 rounded-full border border-gold/40 bg-obsidian px-3 py-0.5 font-akkurat text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
          401 Unauthorized
        </span>
      </div>

      <p className="eyebrow text-gold">Identity Verification</p>
      <h1 className="display mt-3 text-[2.8rem] text-ivory sm:text-[3.8rem]">
        Authentication Required
      </h1>
      <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
        You must be signed in with an authorized WatchGuru account to view this destination.
        Please sign in below to continue.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to={`/admin/login?next=${encodeURIComponent(from)}`}>
          <Button size="lg" className="inline-flex items-center gap-2">
            <LogIn className="size-4" aria-hidden="true" />
            Sign In to Continue
          </Button>
        </Link>
        <Link to="/">
          <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
            <Home className="size-4" aria-hidden="true" />
            Return Home
          </Button>
        </Link>
      </div>
    </Container>
  )
}
