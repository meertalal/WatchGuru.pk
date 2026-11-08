import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { ContactHero } from '../components/contact/ContactHero'
import { ContactForm } from '../components/contact/ContactForm'
import { ContactInformation } from '../components/contact/ContactInformation'
import { ContactMap } from '../components/contact/ContactMap'
import { Container } from '../components/ui/Container'
import { Reveal } from '../components/ui/Reveal'

export function Contact() {
  useDocumentMeta({
    title: 'Contact Us | WatchGuru Concierge',
    description:
      'Questions about a watch, servicing or a private viewing? WhatsApp +92 322 2242389, daily 9am to 9pm PKT, or visit our Karachi boutique.',
  })

  return (
    <>
      <ContactHero
        eyebrow="We’re here to help"
        title="Contact Us"
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-obsidian py-16 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 xl:gap-16">
            {/* Contact form */}
            <Reveal>
              <div className="h-full border border-line bg-charcoal p-6 sm:p-8 lg:p-10">
                <p className="eyebrow text-gold">Contact Us</p>
                <h2 className="mt-3 font-cormorant text-[2.3rem] leading-[1.05] text-ivory sm:text-[2.9rem]">
                  Get In Touch
                </h2>
                <p className="mt-4 max-w-md text-[13px] font-light leading-[1.85] text-ash">
                  Tell us what you are looking for and our concierge team will guide you personally.
                </p>

                <div className="mt-8">
                  <ContactForm variant="contact" />
                </div>
              </div>
            </Reveal>

            {/* Contact information and map */}
            <Reveal delay={100} className="flex flex-col gap-8">
              <div>
                <p className="eyebrow text-gold">Concierge</p>
                <h2 className="mt-3 font-cormorant text-[2rem] leading-[1.1] text-ivory sm:text-[2.4rem]">
                  Reach us directly.
                </h2>
                <p className="mt-4 text-[13px] font-light leading-[1.85] text-ash">
                  Whether you are choosing your first mechanical watch or adding to a collection, we
                  are happy to answer questions, arrange a private viewing or help with a servicing
                  request.
                </p>
              </div>

              <ContactInformation />
              <ContactMap />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  )
}
