import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { registerSchema, type RegisterValues } from '../lib/validation'
import { useAuth } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { Container } from '../components/ui/Container'
import { TextField } from '../components/ui/FormControls'
import { Button } from '../components/ui/Button'

export function AccountRegister() {
  const { register: registerAccount } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/account'
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useDocumentMeta({
    title: 'Create Account',
    description:
      'Join the WatchGuru.pk members’ lounge — track orders, save watches to your wishlist and enjoy faster checkout.',
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterValues) => {
    setError('')
    const result = await registerAccount({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    })
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-xl">
        <div className="text-center">
          <p className="eyebrow text-gold">Members’ Lounge</p>
          <h1 className="mt-3 text-3xl sm:text-4xl">Create your account</h1>
          <p className="mt-2 text-sm text-ash">
            Order tracking, saved wishlist and a head start on every new release.
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

          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="First name"
              id="firstName"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextField
              label="Last name"
              id="lastName"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <TextField
              label="Email"
              id="email"
              type="email"
              autoComplete="email"
              containerClassName="sm:col-span-2"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="Phone (WhatsApp preferred)"
              id="phone"
              type="tel"
              autoComplete="tel"
              containerClassName="sm:col-span-2"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <div className="relative">
              <TextField
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide passwords' : 'Show passwords'}
                className="absolute right-3 top-9 text-ash transition-colors hover:text-white"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <TextField
              label="Confirm password"
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating your account…' : 'Create account'}
          </Button>

          <p className="mt-5 text-center text-sm text-ash">
            Already a member?{' '}
            <Link to="/account/login" state={{ from }} className="font-medium text-white underline-offset-4 hover:text-gold hover:underline">
              Sign in
            </Link>
          </p>

          <p className="mt-4 flex items-center justify-center gap-2 text-center text-[11px] text-ash">
            <ShieldCheck className="size-3.5 text-gold" aria-hidden="true" />
            Passwords are stored salted and hashed on this device only.
          </p>
        </form>
      </div>
    </Container>
  )
}
