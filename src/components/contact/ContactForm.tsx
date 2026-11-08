import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck, Send } from 'lucide-react'
import { contactSchema, type ContactValues } from '../../lib/validation'
import { Button } from '../ui/Button'
import { TextAreaField, TextField } from '../ui/FormControls'

type ContactFormVariant = 'default' | 'contact'

const CONCIERGE_EMAIL = 'concierge@watchguru.pk'

/**
 * The concierge contact form — shared by the Contact page and the homepage
 * contact section. Every submission composes an email draft in the visitor's
 * mail client, so a success state is only shown once a real draft exists.
 */
export function ContactForm({ variant = 'default' }: { variant?: ContactFormVariant }) {
  const [sent, setSent] = useState(false)
  const [mailtoHref, setMailtoHref] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', subject: '', message: '' },
  })

  const onSubmit = (values: ContactValues) => {
    const body = `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
    const href = `mailto:${CONCIERGE_EMAIL}?subject=${encodeURIComponent(
      values.subject,
    )}&body=${encodeURIComponent(body)}`
    setMailtoHref(href)
    setSent(true)
    window.location.assign(href)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center py-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
          <MailCheck className="size-6" strokeWidth={1.3} aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-cormorant text-2xl text-ivory">Your email app is opening</h3>
        <p className="mt-3 max-w-sm text-[12.5px] font-light leading-relaxed text-ash">
          Send the message from your email app to reach our concierge. If nothing opened, use the
          direct link below.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={mailtoHref}
            className="inline-flex items-center justify-center gap-2 border border-button bg-button px-6 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors duration-300 hover:border-gold-bright hover:bg-gold-bright"
          >
            Open email draft
          </a>
          <Button
            type="button"
            variant="outline"
            className="rounded-full!"
            onClick={() => setSent(false)}
          >
            Write another message
          </Button>
        </div>
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

      <Button
        type="submit"
        size="lg"
        className={isContact ? 'mt-1 w-full rounded-full! py-4' : 'w-full sm:w-auto'}
      >
        <Send className="size-4" aria-hidden="true" />
        {isContact ? 'Submit' : 'Send message'}
      </Button>

      <p className="text-[10.5px] leading-relaxed text-muted">
        This form opens your email app. Nothing is sent until you press send there.
      </p>
    </form>
  )
}
