import { Link } from 'react-router-dom'
import { Reveal } from '../ui/Reveal'
import { Container } from '../ui/Container'

const BACKGROUND =
  'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?auto=format&fit=crop&w=1920&q=85'

interface AboutCTAProps {
  eyebrow?: string
  heading: string
  copy?: string
  actionLabel: string
  actionTo: string
  image?: string
}

/**
 * Wide promotional banner — a full-bleed piece of the collection beneath a
 * heavy overlay, with a small label, a display heading and a rounded CTA.
 */
export function AboutCTA({
  eyebrow = 'The WatchGuru Atelier',
  heading,
  copy,
  actionLabel,
  actionTo,
  image = BACKGROUND,
}: AboutCTAProps) {
  return (
    <section className="relative isolate overflow-hidden border-y border-line">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 size-full object-cover object-[50%_38%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-obsidian/82" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-obsidian/70 via-obsidian/30 to-obsidian/70"
      />

      <Container>
        <Reveal className="flex flex-col items-center py-20 text-center sm:py-24 lg:py-28">
          <p className="eyebrow flex items-center justify-center gap-3 text-gold">
            <span className="gold-rule" aria-hidden="true" />
            {eyebrow}
            <span className="gold-rule" aria-hidden="true" />
          </p>
          <h2 className="mt-5 max-w-3xl font-cormorant text-[2.4rem] leading-[1.06] tracking-[-0.015em] text-ivory sm:text-[3.2rem] lg:text-[3.9rem]">
            {heading}
          </h2>
          {copy && (
            <p className="mt-5 max-w-lg text-[13px] font-light leading-[1.9] text-ash">{copy}</p>
          )}
          <Link
            to={actionTo}
            className="mt-9 inline-flex items-center justify-center rounded-full border border-button bg-button px-10 py-4 font-akkurat text-[10px] font-semibold tracking-[0.2em] text-button-text uppercase transition-colors duration-300 hover:border-gold-bright hover:bg-gold-bright"
          >
            {actionLabel}
          </Link>
        </Reveal>
      </Container>
    </section>
  )
}
