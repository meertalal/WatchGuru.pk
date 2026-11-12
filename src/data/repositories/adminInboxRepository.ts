import type { ContactMessage, NewsletterSubscriber } from '../../types'
import { request } from '../../lib/api'

/** Support inbox module persistence: contact messages and subscribers. */
export interface InboxRepository {
  contactMessages(): Promise<ContactMessage[]>
  removeContactMessage(id: number): Promise<void>
  subscribers(): Promise<NewsletterSubscriber[]>
  removeSubscriber(id: number): Promise<void>
}

export class ApiInboxRepository implements InboxRepository {
  contactMessages(): Promise<ContactMessage[]> {
    return request<ContactMessage[]>('/admin/contact', { auth: true })
  }

  async removeContactMessage(id: number): Promise<void> {
    await request<{ deleted: boolean }>(`/admin/contact/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  }

  subscribers(): Promise<NewsletterSubscriber[]> {
    return request<NewsletterSubscriber[]>('/admin/newsletter', { auth: true })
  }

  async removeSubscriber(id: number): Promise<void> {
    await request<{ deleted: boolean }>(`/admin/newsletter/${id}`, {
      method: 'DELETE',
      auth: true,
    })
  }
}

export const inboxRepository = new ApiInboxRepository()
