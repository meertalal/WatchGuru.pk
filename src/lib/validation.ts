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
