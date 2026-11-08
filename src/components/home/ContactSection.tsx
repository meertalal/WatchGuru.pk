import { Mail, MessageSquare, Phone } from 'lucide-react'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'
import { ContactForm } from '../contact/ContactForm'

const DETAILS = [
  {
    icon: Phone,
    label: 'Call or WhatsApp',
    value: '+92 322 2242389',
    note: 'Daily, 9am to 9pm PKT',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'concierge@watchguru.pk',
    note: 'Replies within one business day',
  },
]

/**
 * Homepage contact section — replaces the former newsletter band.
 * The concierge details sit beside the shared contact form.
 */
export function ContactSection() {
  return (
    <section className="bg-obsidian py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="gold-rule" aria-hidden="true" />
              Concierge
            </p>
            <h2 className="mt-5 font-cormorant text-[2rem] font-normal leading-[1.1] text-ivory sm:text-[2.6rem]">
              Send us a message
            </h2>
            <p className="mt-4 max-w-md text-[13px] font-light leading-[1.9] text-ash">
              Questions about a watch, a servicing request or a private viewing? Our concierge team
              would be glad to assist.
            </p>

            <ul className="mt-9 flex flex-col gap-5">
              {DETAILS.map(({ icon: Icon, label, value, note }) => (
                <li key={label} className="flex items-start gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center text-gold">
                    <Icon className="size-5" strokeWidth={1.3} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-akkurat text-[9px] font-medium tracking-[0.2em] text-ivory uppercase">
                      {label}
                    </p>
                    <p className="mt-1 text-[13px] font-light text-ivory">{value}</p>
                    <p className="mt-0.5 text-[11.5px] font-light text-muted">{note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-center gap-2.5 pt-6 text-[11.5px] font-light text-muted">
              <MessageSquare className="size-4 text-gold" strokeWidth={1.4} aria-hidden="true" />
              Prefer a private viewing? Mention it in your message and we will arrange an
              appointment.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={80}>
            <div className="bg-charcoal p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
