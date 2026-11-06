import { Container } from '../ui/Container'
import { NewsletterForm } from '../newsletter/NewsletterForm'

/** The monthly Dispatch — also present in the footer, kept brief here. */
export function NewsletterBand() {
  return (
    <section className="border-t border-line bg-coal py-12 sm:py-14">
      <Container>
        <div className="grid items-center gap-6 md:grid-cols-2 lg:gap-16">
          <div>
            <p className="eyebrow text-gold">The Dispatch</p>
            <h2 className="mt-2 font-cormorant font-medium text-2xl sm:text-3xl">
              One thoughtful letter a month.
            </h2>
            <p className="mt-2 text-sm text-ash">
              New arrivals, private events and the stories behind our pieces.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </Container>
    </section>
  )
}
