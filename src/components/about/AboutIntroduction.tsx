import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'

const IMAGE =
  'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=1200&q=85'

interface AboutIntroductionProps {
  eyebrow?: string
  heading: string
  copy: string
  secondaryCopy?: string
  image?: string
  imageAlt?: string
}

/**
 * Two-column introduction — framed portrait artwork on the left, the section
 * label, heading, copy and a rounded Contact CTA on the right.
 */
export function AboutIntroduction({
  eyebrow = 'About Us',
  heading,
  copy,
  secondaryCopy,
  image = IMAGE,
  imageAlt = 'Luxury watch on a dark surface',
}: AboutIntroductionProps) {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="relative border border-line/70 p-2 sm:p-3">
              <img
                src={image}
                alt={imageAlt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="gold-rule" aria-hidden="true" />
              {eyebrow}
            </p>
            <h2 className="mt-5 font-cormorant text-[2.4rem] leading-[1.08] tracking-[-0.015em] text-ivory sm:text-[3rem]">
              {heading}
            </h2>
            <p className="mt-6 max-w-xl text-[13.5px] font-light leading-[1.9] text-ash">{copy}</p>
            {secondaryCopy && (
              <p className="mt-4 max-w-xl text-[13.5px] font-light leading-[1.9] text-ash">
                {secondaryCopy}
              </p>
            )}
            <div className="mt-9">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-button bg-button px-10 py-4 font-akkurat text-[10px] font-semibold tracking-[0.2em] text-button-text uppercase transition-colors duration-300 hover:border-gold-bright hover:bg-gold-bright"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
