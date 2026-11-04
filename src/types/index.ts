export type Category = 'men' | 'women' | 'unisex'

export type ProductBadge = 'new' | 'sale' | 'bestseller' | 'limited'

export type DialColor =
  | 'Charcoal'
  | 'Ivory'
  | 'Silver'
  | 'Champagne'
  | 'Midnight Blue'
  | 'Forest Green'
  | 'Black'
  | 'Rose Gold'
  | 'Mother of Pearl'

export type StrapType =
  | 'Leather'
  | 'Stainless Steel'
  | 'Gold'
  | 'Rubber'
  | 'Milanese Mesh'
  | 'NATO Fabric'

export type Collection =
  | 'Heritage'
  | 'Chronograph'
  | 'Diver'
  | 'Dress'
  | 'Aviator'
  | 'Sport'

export type Feature =
  | 'Automatic Movement'
  | 'Sapphire Crystal'
  | 'Water Resistant'
  | 'Chronograph'
  | 'Date Display'
  | 'Skeleton Dial'
  | 'GMT'
  | 'Power Reserve'
  | 'Diamond Set'
  | 'Limited Edition'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  /** Original price when the product is discounted. */
  compareAtPrice?: number
  rating: number
  reviewCount: number
  description: string
  highlights: string[]
  images: string[]
  category: Category
  collections: Collection[]
  dialColor: DialColor
  strapType: StrapType
  caseMaterial: string
  caseSize: string
  movement: string
  features: Feature[]
  specs: ProductSpec[]
  badge?: ProductBadge
  inStock: boolean
  stock: number
  /** ISO date used for "New Arrivals" ordering. */
  addedAt: string
}

export interface CartLine {
  productId: string
  quantity: number
}

export interface ShippingDetails {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  apartment?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface OrderLine {
  productId: string
  name: string
  brand: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  orderNumber: string
  placedAt: string
  email: string
  customerName: string
  shipping: ShippingDetails
  lines: OrderLine[]
  subtotal: number
  shippingCost: number
  discount: number
  tax: number
  total: number
  couponCode?: string
}
