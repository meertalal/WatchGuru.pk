import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { loginSchema, type LoginValues } from '../lib/validation'
import { useAuth } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { TextField } from '../components/ui/FormControls'
import { Button } from '../components/ui/Button'

/**
 * Staff-only sign in for the store admin. Customer accounts have been
 * removed from the storefront; this route exists so /admin stays reachable.
 */
export function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useDocumentMeta({
    title: 'Store Admin | Sign In',
    description: 'WatchGuru.pk store admin. Sign in to manage orders and the catalogue.',
    noindex: true,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    setError('')
    const result = await login(values.email, values.password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-obsidian">
      <Container className="flex flex-1 items-center justify-center py-14">
        <div className="w-full max-w-md">
          <div className="text-center">
            <Link
              to="/"
              className="font-playfair text-[1.5rem] tracking-[0.22em] text-ivory transition-colors hover:text-gold"
            >
              WatchGuru<span className="text-gold">.pk</span>
            </Link>
            <p className="eyebrow mt-4 text-gold">Store Admin</p>
            <h1 className="display mt-3 text-[2.4rem] sm:text-5xl">Staff sign in</h1>
            <p className="mt-2 text-[12.5px] font-light text-ash">
              Sign in to manage orders, products and the boutique catalogue.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-8 bg-charcoal p-6 sm:p-8"
          >
            {error && (
              <p
                role="alert"
                className="mb-4 border border-error/40 bg-error/10 px-4 py-3 text-sm text-error"
              >
                {error}
              </p>
            )}

            <div className="flex flex-col gap-5">
              <TextField
                label="Email"
                id="admin-email"
                type="email"
                autoComplete="email"
                error={errors.email?.message}
                {...register('email')}
              />
              <div className="relative">
                <TextField
                  label="Password"
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  error={errors.password?.message}
                  hint="Minimum 6 characters"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-9 text-muted transition-colors hover:text-gold"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </Button>

            <div className="mt-6 pt-5">
              <p className="flex items-center justify-center gap-2 text-center text-[10.5px] text-muted">
                <ShieldCheck className="size-3.5 text-gold" strokeWidth={1.4} aria-hidden="true" />
                Authorised boutique staff only
              </p>
            </div>
          </form>

          <p className="mt-6 text-center">
            <Link
              to="/"
              className="font-akkurat text-[9px] font-medium tracking-[0.2em] text-muted uppercase transition-colors hover:text-gold"
            >
              Back to the boutique
            </Link>
          </p>
        </div>
      </Container>
    </div>
  )
}
