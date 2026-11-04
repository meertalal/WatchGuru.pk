import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { products } from '../../data/products'
import { ProductImage } from '../ui/ProductImage'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'

const TILES = [
  {
    collection: 'Diver',
    title: 'Dive Watches',
    copy: 'Built for water, worn everywhere.',
    image: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80',
  },
  {
    collection: 'Dress',
    title: 'Dress Watches',
    copy: 'Quiet elegance for the evening.',
    image: 'https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=1200&q=80',
  },
  {
    collection: 'Chronograph',
    title: 'Chronographs',
    copy: 'Complications with clarity.',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?auto=format&fit=crop&w=1200&q=80',
  },
]

export function CollectionsShowcase() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Browse by style"
            title="Collections"
            titleClassName="font-cormorant font-medium"
            description="Whatever the occasion, there is a WatchGuru.pk for it — from the depths of the ocean to the boardroom."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3 lg:mt-16">
          {TILES.map((tile, index) => {
            const count = products.filter((p) => p.collections.includes(tile.collection as never)).length
            return (
              <Reveal key={tile.collection} delay={index * 90}>
                <Link
                  to={`/shop?collection=${encodeURIComponent(tile.collection)}`}
                  className="group relative block overflow-hidden"
                >
                  <ProductImage
                    src={tile.image}
                    alt={tile.title}
                    label={tile.title}
                    className="aspect-[3/4] w-full"
                    imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
                    <div>
                      <p className="eyebrow text-gold">{count} pieces</p>
                      <h3 className="mt-2 font-cormorant font-medium text-2xl text-ivory">{tile.title}</h3>
                      <p className="mt-1 text-xs text-stone-300">{tile.copy}</p>
                    </div>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-white">
                      <ArrowUpRight className="size-4" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
