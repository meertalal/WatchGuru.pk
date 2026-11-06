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
  /** Set when the order was placed by a signed-in customer. */
  accountId?: string
}

/* ------------------------------------------------------------------ */
/*  Customer accounts                                                  */
/* ------------------------------------------------------------------ */

export type AccountRole = 'customer' | 'admin'

export interface CustomerAccount {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  salt: string
  role: AccountRole
  createdAt: string
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

/** The account shape that is safe to keep in memory and render. */
export type AccountProfile = Omit<CustomerAccount, 'passwordHash' | 'salt'>

/** Fields a customer may edit from their account dashboard. */
export type ProfilePatch = Partial<
  Pick<
    CustomerAccount,
    'firstName' | 'lastName' | 'phone' | 'address' | 'city' | 'state' | 'postalCode' | 'country'
  >
>
