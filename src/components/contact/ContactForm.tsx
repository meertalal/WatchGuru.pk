import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck, Send } from 'lucide-react'
import { contactSchema, type ContactValues } from '../../lib/validation'
import { errorMessage } from '../../lib/api'
import { sendContactMessage } from '../../data/repositories/supportRepository'
import { Button } from '../ui/Button'
import { TextAreaField, TextField } from '../ui/FormControls'

type ContactFormVariant = 'default' | 'contact'

/**
 * The concierge contact form — shared by the Contact page and the homepage
 * contact section. Messages are stored by the API so nothing depends on the
 * visitor having a mail client configured.
 */
export function ContactForm({ variant = 'default' }: { variant?: ContactFormVariant }) {
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = async (values: ContactValues) => {
    setSubmitError('')
    try {
      await sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      })
      reset()
      setSent(true)
    } catch (error) {
      setSubmitError(errorMessage(error, 'Your message could not be sent. Please try again.'))
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <MailCheck className="size-6" strokeWidth={1.3} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-cormorant text-2xl text-ivory">Message received</h3>
        <p className="mt-3 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
          Thank you for writing. A confirmation has been sent to your inbox, and our concierge
          replies within one business day, usually much sooner.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6 rounded-full!"
          onClick={() => setSent(false)}
        >
          Write another message
        </Button>
      </div>
    )
  }

  const isContact = variant === 'contact'
  const fieldClassName = isContact ? 'h-12 rounded-md hover:border-gold/50' : undefined
  const textareaClassName = isContact
    ? 'min-h-40 rounded-md hover:border-gold/50'
    : undefined

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <TextField
        label="Name"
        id="contact-name"
        autoComplete="name"
        placeholder="Your full name"
        error={errors.name?.message}
        className={fieldClassName}
        {...register('name')}
      />
      <TextField
        label="Email"
        id="contact-email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        className={fieldClassName}
        {...register('email')}
      />
      <TextField
        label="Subject"
        id="contact-subject"
        placeholder="What is this about?"
        error={errors.subject?.message}
        className={fieldClassName}
        {...register('subject')}
      />
      <TextAreaField
        label="Message"
        id="contact-message"
        rows={5}
        placeholder="How can we help?"
        error={errors.message?.message}
        className={textareaClassName}
        {...register('message')}
      />

      {submitError && (
        <p role="alert" className="border border-error/40 bg-error/10 px-4 py-3 text-[12px] leading-relaxed text-error">
          {submitError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className={isContact ? 'mt-1 w-full rounded-full! py-4' : 'w-full sm:w-auto'}
      >
        <Send className="size-4" aria-hidden="true" />
        {isSubmitting ? 'Sending…' : isContact ? 'Submit' : 'Send message'}
      </Button>

      <p className="text-[10.5px] leading-relaxed text-muted">
        Your message goes straight to our concierge desk. We reply within one business day.
      </p>
    </form>
  )
}
