import { Link } from 'react-router-dom'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'

export function NotFound() {
  useDocumentMeta({
    title: 'Page Not Found',
    description: 'The page you were looking for has moved or never existed.',
  })

  return (
    <Container className="flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow text-gold">Error 404</p>
      <h1 className="mt-4 text-5xl sm:text-6xl">This page keeps its own time.</h1>
      <p className="mt-4 max-w-md text-sm text-ash">
        The page you were looking for has moved or never existed. Let us guide you back to the
        boutique.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link to="/">
          <Button size="lg">Return home</Button>
        </Link>
        <Link to="/collections/all">
          <Button size="lg" variant="outline">
            Browse watches
          </Button>
        </Link>
      </div>
    </Container>
  )
}
