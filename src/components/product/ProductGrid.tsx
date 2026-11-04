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
        'grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-7 lg:gap-y-14',
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} eager={index < 4} />
      ))}
    </div>
  )
}
