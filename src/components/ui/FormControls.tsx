import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { classNames } from '../../lib/format'

const CONTROL =
  'w-full border bg-charcoal px-4 py-3 font-lato text-sm text-white outline-none transition-colors placeholder:text-ash focus:border-gold'

function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block font-montserrat text-[10px] font-medium tracking-[0.18em] text-ash uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ash">{hint}</p>
      ) : null}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  containerClassName?: string
}

export function TextField({
  label,
  error,
  hint,
  id,
  className,
  containerClassName,
  ...props
}: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} className={containerClassName}>
      <input
        id={id}
        className={classNames(CONTROL, error ? 'border-error' : 'border-line', className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </FieldShell>
  )
}

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  hint?: string
  containerClassName?: string
}

export function TextAreaField({
  label,
  error,
  hint,
  id,
  className,
  containerClassName,
  ...props
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} className={containerClassName}>
      <textarea
        id={id}
        className={classNames(
          CONTROL,
          'resize-y',
          error ? 'border-error' : 'border-line',
          className,
        )}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </FieldShell>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  containerClassName?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export function SelectField({
  label,
  error,
  hint,
  id,
  className,
  containerClassName,
  options,
  placeholder,
  ...props
}: SelectFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} className={containerClassName}>
      <select
        id={id}
        className={classNames(CONTROL, 'appearance-none', error ? 'border-error' : 'border-line', className)}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
