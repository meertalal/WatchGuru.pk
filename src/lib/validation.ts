import { z } from 'zod'

/**
 * Zod schemas shared by the newsletter, contact and checkout forms.
 * Email is validated with a version-agnostic regex so the schemas behave
 * identically across Zod releases.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const emailField = z
  .string()
  .min(1, 'Email is required')
  .regex(EMAIL_RE, 'Enter a valid email address')

/* ------------------------------------------------------------------ */
/*  Newsletter                                                         */
/* ------------------------------------------------------------------ */

export const newsletterSchema = z.object({ email: emailField })
export type NewsletterValues = z.infer<typeof newsletterSchema>

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: emailField,
  subject: z.string().min(3, 'Please add a short subject'),
  message: z.string().min(10, 'Please tell us a little more (10+ characters)'),
})
export type ContactValues = z.infer<typeof contactSchema>

/* ------------------------------------------------------------------ */
/*  Checkout                                                           */
/* ------------------------------------------------------------------ */

export const checkoutSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: emailField,
  phone: z.string().min(7, 'Enter a valid phone number'),
  address: z.string().min(4, 'Enter your street address'),
  apartment: z.string(),
  city: z.string().min(2, 'Required'),
  state: z.string().min(2, 'Required'),
  postalCode: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Select a country'),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>

export const COUNTRIES = [
  'Pakistan',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Switzerland',
  'Japan',
  'Singapore',
  'United Arab Emirates',
]

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/

export const phoneField = z
  .string()
  .min(7, 'Enter a valid phone number')
  .regex(PHONE_RE, 'Enter a valid phone number, e.g. +92 300 1234567')

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginValues = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Required'),
    lastName: z.string().min(2, 'Required'),
    email: emailField,
    phone: phoneField,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
export type RegisterValues = z.infer<typeof registerSchema>

export const profileSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  phone: phoneField,
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string().min(2, 'Select a country'),
})
export type ProfileValues = z.infer<typeof profileSchema>

/* ------------------------------------------------------------------ */
/*  Track order                                                        */
/* ------------------------------------------------------------------ */

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .min(6, 'Enter your order number, e.g. WG-DEMO2041')
    .transform((v) => v.trim().toUpperCase()),
  email: emailField,
})
export type TrackOrderValues = z.infer<typeof trackOrderSchema>

/* ------------------------------------------------------------------ */
/*  Admin — product editor                                             */
/* ------------------------------------------------------------------ */

const COLLECTION_VALUES = [
  'Heritage',
  'Chronograph',
  'Diver',
  'Dress',
  'Aviator',
  'Sport',
  'Executive',
  'Fashion',
  'Signature',
] as const

export const adminProductSchema = z.object({
  name: z.string().min(3, 'Name is required'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Lowercase letters, numbers and hyphens only'),
  brand: z.string().min(2, 'Select a brand'),
  category: z.enum(['men', 'women', 'unisex']),
  price: z.number().int('Whole rupees only').min(1, 'Price must be at least Rs. 1'),
  compareAtPrice: z.number().int().min(0).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  caseMaterial: z.string().min(2, 'Required'),
  caseSize: z.string().min(1, 'Required'),
  movement: z.string().min(2, 'Required'),
  dialColor: z.string().min(1),
  strapType: z.string().min(1),
  badge: z.string(),
  description: z.string().min(20, 'Describe the piece in at least 20 characters'),
  inStock: z.boolean(),
  collections: z.array(z.enum(COLLECTION_VALUES)).min(1, 'Pick at least one collection'),
  highlights: z.string(),
  images: z
    .string()
    .refine((value) => value.split('\n').map((l) => l.trim()).filter(Boolean).length > 0, {
      message: 'Add at least one image URL',
    }),
  specs: z.string(),
})
export type AdminProductValues = z.infer<typeof adminProductSchema>
