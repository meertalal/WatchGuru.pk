import type { Product } from '../../types'
import { classNames } from '../../lib/format'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Product[]
  className?: string
  columns?: 3 | 4
}

export function ProductGrid({ products, className, columns = 4 }: ProductGridProps) {
  return (
    <div
      className={classNames(
        'grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-6 sm:gap-y-12 lg:gap-x-6 lg:gap-y-14',
        columns === 4 ? 'md:grid-cols-3 lg:grid-cols-4' : 'md:grid-cols-3',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} eager={index < 4} />
      ))}
    </div>
  )
}
