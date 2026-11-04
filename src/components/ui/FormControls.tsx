import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { classNames } from '../../lib/format'

const CONTROL =
  'w-full border bg-white px-4 py-3 font-lato text-sm text-charcoal outline-none transition-colors placeholder:text-stone-400 focus:border-charcoal'

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
      <label htmlFor={htmlFor} className="mb-2 block font-montserrat text-[10px] font-medium tracking-[0.18em] text-stone-500 uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-stone-400">{hint}</p>
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
        className={classNames(CONTROL, error ? 'border-red-400' : 'border-stone-300', className)}
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
          error ? 'border-red-400' : 'border-stone-300',
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
        className={classNames(CONTROL, 'appearance-none', error ? 'border-red-400' : 'border-stone-300', className)}
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
