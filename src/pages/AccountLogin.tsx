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

export function AccountLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/account'
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useDocumentMeta({
    title: 'Sign In',
    description: 'Sign in to your WatchGuru.pk account — track orders, manage your details and check out faster.',
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
    <Container className="flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="eyebrow text-gold">Members’ Lounge</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-ash">
            Sign in to track orders and check out faster.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 border border-line bg-charcoal p-6 sm:p-8"
        >
          {error && (
            <p role="alert" className="mb-4 border border-error/40 bg-error/10 px-4 py-3 text-sm text-error">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-5">
            <TextField
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <TextField
                label="Password"
                id="password"
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
                className="absolute right-3 top-9 text-ash transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>

          <p className="mt-5 text-center text-sm text-ash">
            New to WatchGuru.pk?{' '}
            <Link to="/account/register" state={{ from }} className="font-medium text-white underline-offset-4 hover:text-gold hover:underline">
              Create an account
            </Link>
          </p>

          <div className="mt-6 border-t border-line pt-5">
            <p className="flex items-center justify-center gap-2 text-center text-[11px] text-ash">
              <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
              Demo sign-in — demo@watchguru.pk / demo1234
            </p>
          </div>
        </form>
      </div>
    </Container>
  )
}
