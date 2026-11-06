import { Quote } from 'lucide-react'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function EditorialQuote() {
  return (
    <section className="bg-obsidian py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto size-8 text-gold" strokeWidth={1.2} />
          <blockquote className="mt-8 font-cormorant font-normal text-2xl leading-relaxed text-white sm:text-[2rem] sm:leading-[1.4]">
            “A fine watch is the only thing you will ever wear that outlives you. We choose every
            piece with that in mind.”
          </blockquote>
          <p className="mt-7 font-montserrat font-medium text-[11px] tracking-[0.24em] text-ash uppercase">
            Ellinor Vance · Founder & Head Curator
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
