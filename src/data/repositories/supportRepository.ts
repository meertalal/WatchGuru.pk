import { request } from '../../lib/api'

export interface ContactInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface WarrantyResult {
  serial: string
  productId: string | null
  verified: boolean
  verifiedAt: string
}

export async function unsubscribeNewsletter(email: string): Promise<void> {
  await request('/newsletter/unsubscribe', { method: 'POST', body: { email } })
}

export async function sendContactMessage(input: ContactInput): Promise<void> {
  await request('/contact', { method: 'POST', body: input })
}

export function verifyWarrantySerial(serial: string): Promise<WarrantyResult> {
  return request<WarrantyResult>(`/warranty/${encodeURIComponent(serial.trim())}`)
}
