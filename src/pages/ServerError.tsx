import { Link } from 'react-router-dom'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

interface ServerErrorProps {
  onRetry?: () => void
  errorDetails?: string
}

export function ServerError({ onRetry, errorDetails }: ServerErrorProps) {
  useDocumentMeta({
    title: '500 Calibre Malfunction',
    description: 'An unexpected internal error interrupted the service.',
    noindex: true,
  })

  return (
    <Container className="flex min-h-[72svh] flex-col items-center justify-center py-20 text-center sm:py-28">
      <div className="relative mb-6 flex size-28 items-center justify-center rounded-full border border-gold/30 bg-coal/70 sm:size-36">
        <AlertTriangle className="size-14 text-gold/80 sm:size-18" strokeWidth={1.2} aria-hidden="true" />
        <span className="absolute -bottom-2 rounded-full border border-gold/40 bg-obsidian px-3 py-0.5 font-akkurat text-[9px] font-semibold tracking-[0.24em] text-gold uppercase">
          500 Error
        </span>
      </div>

      <p className="eyebrow text-gold">Internal Calibre Hiccup</p>
      <h1 className="display mt-3 text-[2.8rem] text-ivory sm:text-[3.8rem]">
        Temporary Complication
      </h1>
      <p className="mt-4 max-w-lg text-[13.5px] font-light leading-relaxed text-ash">
        Our horological servers encountered an unexpected complication while handling your request.
        Our technical watchmakers have been alerted.
      </p>

      {errorDetails && (
        <pre className="mt-4 max-w-lg overflow-x-auto rounded border border-line bg-charcoal/80 p-3 text-left font-mono text-[11px] text-muted">
          {errorDetails}
        </pre>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {onRetry ? (
          <Button size="lg" onClick={onRetry} className="inline-flex items-center gap-2">
            <RefreshCw className="size-4" aria-hidden="true" />
            Retry Action
          </Button>
        ) : (
          <Button size="lg" onClick={() => window.location.reload()} className="inline-flex items-center gap-2">
            <RefreshCw className="size-4" aria-hidden="true" />
            Reload Page
          </Button>
        )}
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
