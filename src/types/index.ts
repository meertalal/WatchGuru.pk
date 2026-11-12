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
  | 'Executive'
  | 'Fashion'
  | 'Signature'

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

export interface ProductVariant {
  id: string
  name: string
  /** Swatch colour representing the finish. */
  swatch: string
  price: number
  /** Alternate image for this finish, when the catalogue has one. */
  image?: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  /** Original price when the product is discounted. */
  compareAtPrice?: number | null
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
  /** Optional finish variants (only where the catalogue actually offers them). */
  variants?: ProductVariant[]
  badge?: ProductBadge | null
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

export type OrderStatus =
  | 'processing'
  | 'confirmed'
  | 'shipped'
  | 'out-for-delivery'
  | 'delivered'
  | 'cancelled'

export interface OrderStatusEntry {
  status: OrderStatus
  /** ISO timestamp of the status change. */
  at: string
  note?: string
}

export type PaymentMethod = 'cod' | 'bank-transfer' | 'easypaisa' | 'jazzcash'

export interface OrderLine {
  productId: string
  slug: string
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
  paymentMethod: PaymentMethod
  status: OrderStatus
  statusHistory: OrderStatusEntry[]
}

/* ------------------------------------------------------------------ */
/*  Store admin                                                        */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Store admin — operations modules                                   */
/* ------------------------------------------------------------------ */

/** One entry in the inventory ledger. */
export interface StockMovement {
  id: number | null
  productId: string
  productName: string
  type: 'in' | 'out' | 'correction'
  /** Signed change applied to stock. */
  quantity: number
  balanceAfter: number
  reason: string
  reference: string | null
  createdAt: string
}

export interface StockSummary {
  products: number
  units: number
  retailValue: number
  lowStock: number
  soldOut: number
  threshold: number
}

export interface StockOverview {
  summary: StockSummary
  levels: Product[]
  movements: StockMovement[]
  threshold: number
}

export interface StockAdjustment {
  productId: string
  type: 'in' | 'out' | 'correction'
  quantity: number
  reason?: string
}

export interface AdminCoupon {
  id: number
  code: string
  type: 'percent' | 'fixed'
  value: number
  label: string
  active: boolean
}

export interface CouponInput {
  code: string
  type: 'percent' | 'fixed'
  value: number
  label: string
  active: boolean
}

/** An aggregated guest customer, built from order history. */
export interface Customer {
  email: string
  name: string
  phone: string
  city: string
  ordersCount: number
  totalSpent: number
  firstOrderAt: string
  lastOrderAt: string
  orderNumbers: string[]
}

export interface AdminWarrantySerial {
  id: number
  serial: string
  productId: string | null
  verified: boolean
  verifiedAt: string | null
  createdAt: string
}

export interface NewsletterSubscriber {
  id: number
  email: string
  createdAt: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

/** The admin account returned by `/api/auth/login` and `/api/auth/me`. */
export interface AdminAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: 'admin'
  createdAt: string
}
