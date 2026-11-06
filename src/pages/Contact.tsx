import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import { contactSchema, type ContactValues } from '../lib/validation'
import { useToast } from '../store'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { PageBanner } from '../components/layout/PageBanner'
import { Container } from '../components/ui/Container'
import { Button } from '../components/ui/Button'
import { Reveal } from '../components/ui/Reveal'
import { TextAreaField, TextField } from '../components/ui/FormControls'

const DETAILS = [
  {
    icon: MapPin,
    title: 'Visit the boutique',
    lines: ['WatchGuru.pk Flagship', 'Phase 6, DHA, Karachi 75500'],
  },
  {
    icon: Phone,
    title: 'Call or WhatsApp',
    lines: ['+92 322 2242389', 'Daily, 9am–9pm PKT'],
  },
  {
    icon: Mail,
    title: 'Email us',
    lines: ['concierge@watchguru.pk', 'Replies within one business day'],
  },
]

const HOURS = [
  { day: 'Monday – Saturday', time: '9:00 – 21:00' },
  { day: 'Sunday', time: '11:00 – 20:00' },
  { day: 'Public holidays', time: 'By appointment' },
]

export function Contact() {
  const { notify } = useToast()
  const [sent, setSent] = useState(false)

  useDocumentMeta({
    title: 'Contact Us — WatchGuru Concierge',
    description:
      'Questions about a watch, servicing or a private viewing? WhatsApp +92 322 2242389, daily 9am–9pm PKT, or visit our Karachi boutique.',
  })

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
    await new Promise((resolve) => setTimeout(resolve, 700))
    setSent(true)
    notify(`Thank you, ${values.name} — your message has been received (demo).`)
    reset()
  }

  return (
    <>
      <PageBanner
        eyebrow="We’re here to help"
        title="Contact Us"
        description="Questions about a watch, a servicing request or a private viewing? Our concierge team would be glad to assist."
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <Container className="py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Details */}
          <div>
            <h2 className="text-2xl">Speak with a specialist</h2>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              Whether you are choosing your first mechanical watch or adding to a collection, we are
              happy to guide you personally.
            </p>

            <ul className="mt-8 flex flex-col gap-6">
              {DETAILS.map(({ icon: Icon, title, lines }) => (
                <li key={title} className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center border border-line bg-charcoal text-gold">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-montserrat text-[11px] font-medium tracking-[0.16em] text-white uppercase">
                      {title}
                    </p>
                    {lines.map((line) => (
                      <p key={line} className="mt-1 text-sm text-ash">
                        {line}
                      </p>
                    ))}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 border border-line bg-charcoal p-6">
              <h3 className="flex items-center gap-2 text-sm font-medium tracking-[0.14em] text-white uppercase">
                <Clock className="size-4 text-gold" strokeWidth={1.6} />
                Opening hours
              </h3>
              <dl className="mt-4 flex flex-col gap-3">
                {HOURS.map((row) => (
                  <div key={row.day} className="flex items-center justify-between text-sm">
                    <dt className="text-ash">{row.day}</dt>
                    <dd className="text-white">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* Form */}
          <Reveal>
            <div className="border border-line bg-charcoal p-6 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="flex size-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                    <Send className="size-6" strokeWidth={1.5} />
                  </span>
                  <h2 className="mt-5 text-2xl">Message sent</h2>
                  <p className="mt-3 max-w-sm text-sm text-ash">
                    Thank you for getting in touch. A member of our concierge team will reply
                    within one business day — usually much sooner on WhatsApp.
                  </p>
                  <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="flex items-center gap-2 text-xl">
                    <MessageSquare className="size-5 text-gold" strokeWidth={1.6} />
                    Send us a message
                  </h2>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
                    <TextField
                      label="Full name"
                      id="contact-name"
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register('name')}
                    />
                    <TextField
                      label="Email"
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register('email')}
                    />
                    <TextField
                      label="Subject"
                      id="contact-subject"
                      error={errors.subject?.message}
                      {...register('subject')}
                    />
                    <TextAreaField
                      label="Message"
                      id="contact-message"
                      rows={5}
                      placeholder="How can we help?"
                      error={errors.message?.message}
                      {...register('message')}
                    />
                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      <Send className="size-4" />
                      {isSubmitting ? 'Sending…' : 'Send message'}
                    </Button>
                    <p className="text-[11px] text-ash">
                      Demo form — submissions are not stored or sent anywhere.
                    </p>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </>
  )
}
