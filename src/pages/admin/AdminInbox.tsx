import { useCallback, useEffect, useMemo, useState } from 'react'
import { Mail, MessageSquare, Search, Trash2, Users, X } from 'lucide-react'
import type { ContactMessage, NewsletterSubscriber } from '../../types'
import { useToast } from '../../store'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { formatDate } from '../../lib/format'
import { errorMessage } from '../../lib/api'
import { inboxRepository } from '../../data/repositories/adminInboxRepository'

type Tab = 'contact' | 'newsletter'

/** Support inbox module: contact messages and newsletter subscribers. */
export function AdminInbox() {
  const { notify } = useToast()
  const [tab, setTab] = useState<Tab>('contact')
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState<string | null>(null)

  useDocumentMeta({
    title: 'Admin | Inbox',
    description: 'WatchGuru.pk support inbox: contact messages and newsletter subscribers.',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [contact, newsletter] = await Promise.all([
        inboxRepository.contactMessages(),
        inboxRepository.subscribers(),
      ])
      setMessages(contact)
      setSubscribers(newsletter)
    } catch (error) {
      notify(errorMessage(error, 'The inbox could not be loaded.'), 'error')
    } finally {
      setLoading(false)
    }
  }, [notify])

  useEffect(() => {
    void load()
  }, [load])

  const filteredMessages = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return messages
    return messages.filter(
      (message) =>
        message.name.toLowerCase().includes(needle) ||
        message.email.toLowerCase().includes(needle) ||
        message.subject.toLowerCase().includes(needle) ||
        message.message.toLowerCase().includes(needle),
    )
  }, [messages, query])

  const filteredSubscribers = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return subscribers
    return subscribers.filter((subscriber) => subscriber.email.toLowerCase().includes(needle))
  }, [subscribers, query])

  const removeMessage = async (message: ContactMessage) => {
    if (!window.confirm(`Delete the message from “${message.name}”?`)) return
    setBusy(`message-${message.id}`)
    try {
      await inboxRepository.removeContactMessage(message.id)
      setMessages((current) => current.filter((entry) => entry.id !== message.id))
      notify('Message deleted.', 'info')
    } catch (error) {
      notify(errorMessage(error, 'The message could not be deleted.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  const removeSubscriber = async (subscriber: NewsletterSubscriber) => {
    if (!window.confirm(`Remove “${subscriber.email}” from the newsletter?`)) return
    setBusy(`subscriber-${subscriber.id}`)
    try {
      await inboxRepository.removeSubscriber(subscriber.id)
      setSubscribers((current) => current.filter((entry) => entry.id !== subscriber.id))
      notify('Subscriber removed.', 'info')
    } catch (error) {
      notify(errorMessage(error, 'The subscriber could not be removed.'), 'error')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-5 sm:p-8">
      <header>
        <p className="eyebrow text-gold">Support</p>
        <h1 className="mt-1 font-cormorant text-2xl text-ivory sm:text-3xl">Inbox</h1>
        <p className="mt-1 max-w-2xl text-[12.5px] font-light leading-relaxed text-ash">
          Contact messages and newsletter subscribers each have their own queue inside this module.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5" role="tablist" aria-label="Inbox queues">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'contact'}
            onClick={() => setTab('contact')}
            className={
              tab === 'contact'
                ? 'flex items-center gap-2 border border-gold/70 bg-charcoal px-3 py-2 font-akkurat text-[10px] font-medium tracking-[0.14em] text-ivory uppercase'
                : 'flex items-center gap-2 border border-line px-3 py-2 font-akkurat text-[10px] font-medium tracking-[0.14em] text-ash uppercase hover:border-gold/50 hover:text-ivory'
            }
          >
            <MessageSquare className="size-3.5" aria-hidden="true" />
            Messages ({messages.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'newsletter'}
            onClick={() => setTab('newsletter')}
            className={
              tab === 'newsletter'
                ? 'flex items-center gap-2 border border-gold/70 bg-charcoal px-3 py-2 font-akkurat text-[10px] font-medium tracking-[0.14em] text-ivory uppercase'
                : 'flex items-center gap-2 border border-line px-3 py-2 font-akkurat text-[10px] font-medium tracking-[0.14em] text-ash uppercase hover:border-gold/50 hover:text-ivory'
            }
          >
            <Users className="size-3.5" aria-hidden="true" />
            Subscribers ({subscribers.length})
          </button>
        </div>

        <label className="flex min-w-[220px] flex-1 items-center gap-2 border border-line bg-charcoal px-3 py-2.5 sm:max-w-sm">
          <Search className="size-4 text-muted" strokeWidth={1.4} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={tab === 'contact' ? 'Search messages…' : 'Search subscribers…'}
            aria-label="Search inbox"
            className="w-full bg-transparent font-inter text-[12.5px] font-light text-ivory outline-none placeholder:text-muted"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="text-muted hover:text-gold">
              <X className="size-4" strokeWidth={1.4} />
            </button>
          )}
        </label>
      </div>

      {tab === 'contact' ? (
        <ul className="mt-5 flex flex-col gap-3">
          {filteredMessages.map((message) => (
            <li key={message.id} className="bg-charcoal px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] text-ivory">{message.subject}</p>
                  <p className="mt-0.5 text-[10.5px] text-muted">
                    {message.name} · <a href={`mailto:${message.email}`} className="hover:text-gold">{message.email}</a> ·{' '}
                    {formatDate(message.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy === `message-${message.id}`}
                  onClick={() => void removeMessage(message)}
                  aria-label={`Delete message from ${message.name}`}
                  className="p-2 text-ash transition-colors hover:text-error disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="mt-3 max-w-3xl text-[12px] font-light leading-relaxed whitespace-pre-line text-ash">
                {message.message}
              </p>
            </li>
          ))}
          {filteredMessages.length === 0 && (
            <li className="bg-charcoal px-6 py-12 text-center text-[12.5px] text-ash">
              {loading ? 'Loading messages…' : query ? `Nothing matches “${query}”.` : 'No contact messages yet.'}
            </li>
          )}
        </ul>
      ) : (
        <div className="mt-5 overflow-x-auto bg-charcoal">
          <table className="w-full min-w-[560px] text-left text-[12.5px]">
            <thead>
              <tr className="font-akkurat text-[8.5px] tracking-[0.2em] text-muted uppercase">
                <th scope="col" className="px-4 py-3">Email</th>
                <th scope="col" className="px-4 py-3">Subscribed</th>
                <th scope="col" className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2 text-ivory">
                      <Mail className="size-3.5 text-muted" strokeWidth={1.5} aria-hidden="true" />
                      {subscriber.email}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ash">{formatDate(subscriber.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled={busy === `subscriber-${subscriber.id}`}
                        onClick={() => void removeSubscriber(subscriber)}
                        aria-label={`Remove ${subscriber.email}`}
                        className="p-2 text-ash transition-colors hover:text-error disabled:opacity-50"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-ash">
                    {loading ? 'Loading subscribers…' : query ? `Nothing matches “${query}”.` : 'No subscribers yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
