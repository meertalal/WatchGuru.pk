import { Link } from 'react-router-dom'
import { Home, Lock, ShieldAlert } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export function Forbidden() {
  useDocumentMeta({
    title: '403 Access Forbidden',
    description: 'You do not have administrative clearance to access this sector of WatchGuru.',
    noindex: true,
  })

  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <div className="relative mb-6 flex size-28 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-36">
        <ShieldAlert className="size-14 text-gold/80 sm:size-18" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute -bottom-2 rounded-full border border-gold/40 bg-obsidian px-3 py-0.5 font-akkurat text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
          403 Forbidden
        </span>
      </div>

      <p className="eyebrow text-gold">Vault Access Restricted</p>
      <h1 className="display mt-3 text-[2.8rem] text-ivory sm:text-[3.8rem]">
        Clearance Required
      </h1>
      <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
        This area is reserved for authenticated WatchGuru concierge staff and administrators.
        Please return to the public boutique or sign in with authorized credentials.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/">
          <Button size="lg" className="inline-flex items-center gap-2">
            <Home className="size-4" aria-hidden="true" />
            Return Home
          </Button>
        </Link>
        <Link to="/admin/login">
          <Button size="lg" variant="outline" className="inline-flex items-center gap-2">
            <Lock className="size-4" aria-hidden="true" />
            Staff Sign In
          </Button>
        </Link>
      </div>
    </Container>
  )
}
