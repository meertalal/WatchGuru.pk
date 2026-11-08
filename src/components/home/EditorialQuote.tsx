import { Quote } from 'lucide-react'
import { Container } from '../ui/Container'
import { Reveal } from '../ui/Reveal'

export function EditorialQuote() {
  return (
    <section className="bg-coal py-20 sm:py-28 lg:py-32">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto size-7 text-gold" strokeWidth={1.1} />
          <blockquote className="mt-9 font-cormorant text-[1.7rem] font-light leading-[1.35] text-ivory sm:text-[2.2rem] sm:leading-[1.35]">
            “A fine watch is the only thing you will ever wear that outlives you. We choose every
            piece with that in mind.”
          </blockquote>
          <p className="mt-8 font-akkurat text-[9px] font-medium tracking-[0.3em] text-ash uppercase">
            Ellinor Vance, Founder &amp; Head Curator
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
