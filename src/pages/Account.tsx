import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BadgeCheck,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { COUNTRIES, profileSchema, type ProfileValues } from '../lib/validation'
import { formatDate, formatPriceExact, classNames } from '../lib/format'
import { useAuth, useOrders, useToast } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PAYMENT_METHOD_LABEL, ORDER_STATUS_LABEL } from '../lib/orders'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { SelectField, TextField } from '../components/ui/FormControls'

const STATUS_PILL: Record<string, string> = {
  processing: 'border border-line bg-white/[0.03] text-ash',
  confirmed: 'border border-gold/40 bg-gold/5 text-gold',
  shipped: 'border border-gold/30 text-ivory',
  'out-for-delivery': 'border border-gold/40 bg-gold/10 text-gold',
  delivered: 'border border-gold/60 bg-gold/15 text-gold-bright',
  cancelled: 'border border-line text-ash line-through',
}

export function Account() {
  const { account, isAdmin, loading, logout, updateProfile } = useAuth()
  const { listForEmail } = useOrders()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  useDocumentMeta({
    title: 'My Account',
    description: 'Your WatchGuru.pk account — orders, tracking, profile and address book.',
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    values: account
      ? {
          firstName: account.firstName,
          lastName: account.lastName,
          phone: account.phone,
          address: account.address ?? '',
          city: account.city ?? '',
          state: account.state ?? '',
          postalCode: account.postalCode ?? '',
          country: account.country ?? 'Pakistan',
        }
      : undefined,
  })

  if (loading) {
    return (
      <Container className="py-24 text-center text-sm text-ash">Loading your account…</Container>
    )
  }
  if (!account) {
    return <Navigate to="/account/login" state={{ from: '/account' }} replace />
  }

  const orders = listForEmail(account.email)
  const initials = `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase()

  const onSubmit = async (values: ProfileValues) => {
    const ok = await updateProfile(values)
    if (ok) {
      notify('Your details have been saved.')
      setEditing(false)
      reset(values)
    } else {
      notify('We couldn’t save your details — please try again.', 'error')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Container className="py-10 lg:py-14">
      {/* Header */}
      <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center rounded-full bg-charcoal font-playfair text-xl text-gold sm:size-20 sm:text-2xl"
          >
            {initials}
          </span>
          <div>
            <p className="eyebrow text-gold">My Account</p>
            <h1 className="mt-1 text-2xl sm:text-3xl">
              {account.firstName} {account.lastName}
            </h1>
            <p className="mt-1 text-xs text-ash">
              Member since {formatDate(account.createdAt)} · {account.email}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-fit items-center gap-2 border border-line px-5 py-3 font-montserrat text-[10px] font-medium tracking-[0.2em] text-ash uppercase transition-colors hover:border-gold hover:text-white"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </button>
      </div>

      {/* Admin banner */}
      {isAdmin && (
        <Link
          to="/admin"
          className="mt-6 flex items-center justify-between gap-4 border border-gold/50 bg-gold/10 px-5 py-4 transition-colors hover:border-gold"
        >
          <span className="flex items-center gap-3 text-sm text-white">
            <LayoutDashboard className="size-5 text-gold" aria-hidden="true" />
            <span>
              <span className="block font-medium">Store admin access</span>
              <span className="mt-0.5 block text-xs text-ash">
                Orders queue, product manager and low-stock alerts.
              </span>
            </span>
          </span>
          <ChevronRight className="size-5 text-ash" aria-hidden="true" />
        </Link>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Profile & address book */}
        <section className="lg:col-span-4" aria-labelledby="profile-heading">
          <div className="border border-line bg-charcoal p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 id="profile-heading" className="flex items-center gap-2 text-lg">
                <BadgeCheck className="size-5 text-gold" aria-hidden="true" />
                Profile & address
              </h2>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="font-montserrat text-[10px] font-medium tracking-[0.2em] text-gold uppercase transition-opacity hover:opacity-75"
                aria-expanded={editing}
              >
                {editing ? 'Close' : 'Edit'}
              </button>
            </div>

            {!editing ? (
              <dl className="mt-5 flex flex-col gap-3 text-sm">
                {[
                  ['Phone', account.phone],
                  ['Address', account.address],
                  ['City', account.city],
                  ['Region', account.state],
                  ['Postal code', account.postalCode],
                  ['Country', account.country],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
                    <dt className="text-[10px] tracking-[0.18em] text-ash uppercase">{label}</dt>
                    <dd className="text-right text-white">{(value as string) || '—'}</dd>
                  </div>
                ))}
                <p className="mt-2 flex items-start gap-2 text-[11px] leading-relaxed text-ash">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden="true" />
                  These details prefill checkout. We never share them.
                </p>
              </dl>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5 flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="First name" id="firstName" error={errors.firstName?.message} {...register('firstName')} />
                  <TextField label="Last name" id="lastName" error={errors.lastName?.message} {...register('lastName')} />
                </div>
                <TextField label="Phone" id="phone" type="tel" error={errors.phone?.message} {...register('phone')} />
                <TextField label="Street address" id="address" error={errors.address?.message} {...register('address')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="City" id="city" error={errors.city?.message} {...register('city')} />
                  <TextField label="Region" id="state" error={errors.state?.message} {...register('state')} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Postal code" id="postalCode" error={errors.postalCode?.message} {...register('postalCode')} />
                  <SelectField
                    label="Country"
                    id="country"
                    error={errors.country?.message}
                    options={COUNTRIES.map((c) => ({ value: c, label: c }))}
                    {...register('country')}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting || !isDirty}>
                  {isSubmitting ? 'Saving…' : 'Save changes'}
                </Button>
              </form>
            )}
          </div>
        </section>

        {/* Order history */}
        <section className="lg:col-span-8" aria-labelledby="orders-heading">
          <div className="border border-line bg-charcoal">
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 id="orders-heading" className="flex items-center gap-2 text-lg">
                <Package className="size-5 text-gold" aria-hidden="true" />
                Order history
              </h2>
              <Link
                to="/track-order"
                className="font-montserrat text-[10px] font-medium tracking-[0.2em] text-white uppercase transition-colors hover:text-gold"
              >
                Track an order →
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-6 py-14 text-center">
                <Truck className="size-10 text-ash" strokeWidth={1.2} aria-hidden="true" />
                <p className="text-lg">No orders yet</p>
                <p className="max-w-sm text-sm text-ash">
                  When you place an order, it will appear here with live tracking from our
                  atelier to your doorstep.
                </p>
                <Link to="/collections/all">
                  <Button size="lg" className="mt-2">Browse the boutique</Button>
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {orders.map((order) => (
                  <li key={order.orderNumber} className="px-6 py-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-inter font-medium text-white">{order.orderNumber}</p>
                        <p className="mt-0.5 text-[11px] text-ash">
                          {formatDate(order.placedAt)} · {order.lines.length}{' '}
                          {order.lines.length === 1 ? 'piece' : 'pieces'} ·{' '}
                          {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                        </p>
                      </div>
                      <span
                        className={classNames(
                          'rounded-full px-3 py-1 font-montserrat text-[9px] font-semibold tracking-[0.18em] uppercase',
                          STATUS_PILL[order.status] ?? 'bg-coal text-ash',
                        )}
                      >
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
                      <p className="text-sm text-ash">
                        Total ·{' '}
                        <span className="text-white">{formatPriceExact(order.total)}</span>
                      </p>
                      <Link
                        to={`/track-order?number=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(order.email)}`}
                        className="inline-flex items-center gap-1.5 font-montserrat text-[10px] font-medium tracking-[0.2em] text-gold uppercase transition-opacity hover:opacity-75"
                      >
                        View tracking
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </Container>
  )
}
