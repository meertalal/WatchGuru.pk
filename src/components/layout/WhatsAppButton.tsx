const WHATSAPP_NUMBER = '923222242389'
const PRE_FILLED_MESSAGE = 'Hello WatchGuru.pk, I would like some help with a watch.'

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(PRE_FILLED_MESSAGE)}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Chat with WatchGuru.pk on WhatsApp"
      className="fixed right-5 bottom-24 z-[80] flex size-14 items-center justify-center rounded-full border border-gold/60 bg-gold shadow-[0_12px_30px_-12px_rgba(201,187,165,0.45)] transition-transform duration-300 hover:scale-110 lg:right-8 lg:bottom-10"
    >
      <svg viewBox="0 0 24 24" fill="#080808" aria-hidden="true" className="size-7">
        <path d="M12.04 2.5c-5.29 0-9.6 4.31-9.6 9.61 0 1.8.5 3.56 1.44 5.08l-.97 5.16 5.28-1.39a9.54 9.54 0 0 0 3.84.81h.01c5.29 0 9.6-4.31 9.6-9.61s-4.31-9.66-9.6-9.66zm0 17.7h-.01a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.99.79.8-2.91-.19-.31a7.7 7.7 0 0 1-1.18-3.78c0-4.29 3.49-7.78 7.78-7.78 4.29 0 7.78 3.49 7.78 7.78 0 4.29-3.49 7.78-7.78 7.78zm4.26-5.83c-.23-.12-1.37-.68-1.58-.76-.21-.08-.37-.12-.53.12-.16.23-.6.76-.74.92-.14.16-.27.17-.5.05-.23-.11-.97-.36-1.84-1.14-.68-.61-1.14-1.36-1.27-1.59-.13-.23 0-.35.1-.46.1-.1.23-.26.34-.39.11-.13.15-.22.22-.37.08-.15.04-.28-.02-.39-.07-.12-.53-1.27-.72-1.74-.19-.46-.38-.4-.53-.41h-.45c-.15 0-.39.06-.59.23-.2.17-.78.76-.78 1.86 0 1.1.8 2.16.91 2.31.11.15 1.57 2.4 3.8 3.36.53.23.95.37 1.27.47.53.17.1.15 1.08.17.61.02 1.16-.18 1.37-.5.21-.32.21-.75.15-.82-.06-.07-.22-.11-.45-.23z" />
      </svg>
    </a>
  )
}
