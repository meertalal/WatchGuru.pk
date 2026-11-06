import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { PolicyLayout, PolicySection } from '../../components/policies/PolicyLayout'

export function TermsOfService() {
  useDocumentMeta({
    title: 'Terms of Service',
    description:
      'The terms governing WatchGuru.pk — authenticity guarantee, orders and confirmation, COD advance, warranty exclusions and governing law.',
  })

  return (
    <PolicyLayout
      title="Terms of Service"
      description="The fine print, written plainly — what we promise you, and what we ask of you."
      lastUpdated="4 November 2026"
    >
      <PolicySection title="1. About this store">
        <p>
          WatchGuru.pk (“WatchGuru”, “we”, “us”) is a Pakistani online boutique selling 100%
          original luxury watches from authorised partner maisons and our own in-house label,
          WatchGuru Atelier. By using this site or placing an order, you agree to these terms,
          our shipping policy and our refund &amp; exchange policy, all of which form a single
          agreement between you and us.
        </p>
      </PolicySection>

      <PolicySection title="2. Authenticity guarantee">
        <p>
          Every watch we sell is 100% original, sourced through authorised distributors or
          direct from maisons, and verified in-house before dispatch. Each piece ships with its
          papers, warranty card, seals and packaging intact. If a watch we sell is ever found to
          be non-genuine, we will refund double your purchase price — unconditionally.
        </p>
        <p>
          Maison names and logos are trademarks of their respective owners. WatchGuru.pk is an
          independent boutique and is not affiliated with, endorsed by, or sponsored by the
          maisons whose watches we carry, unless explicitly stated otherwise.
        </p>
      </PolicySection>

      <PolicySection title="3. Orders and confirmation">
        <p>
          Placing an order creates a request to purchase. No contract forms until we confirm
          your order by phone or WhatsApp and receive the applicable advance (Rs. 1,000 for COD,
          or the agreed advance for other methods). If the watch sells out before confirmation,
          we will offer a priority waitlist, a substitute piece or an immediate refund.
        </p>
        <p>
          Order numbers are issued instantly at checkout and are valid for 48 hours unconfirmed.
          Prices are listed in Pakistani rupees, include all duties and taxes, and may change
          without notice — the price confirmed on the call is the price you pay.
        </p>
      </PolicySection>

      <PolicySection title="4. Payment methods">
        <p>
          We accept Cash on Delivery (with Rs. 1,000 confirmation advance), Easypaisa, JazzCash
          and bank transfer. <strong>No card details are collected or stored on this site.</strong>{' '}
          Advances for cancelled-before-dispatch orders are refunded within five to seven working
          days. We do not offer instalments or credit of any kind.
        </p>
      </PolicySection>

      <PolicySection title="5. Warranty">
        <p>
          Every watch carries a one-year machine warranty covering movement and manufacturing
          defects (see our Warranty page for the full schedule of what is covered and what is
          excluded). Warranty claims are handled by our own service centre; unauthorised opening
          or servicing voids the warranty.
        </p>
      </PolicySection>

      <PolicySection title="6. Returns and refunds">
        <p>
          Returns and exchanges within seven calendar days of delivery are governed by our Refund
          &amp; Exchange Policy, which forms part of these terms. Strap wear, water damage beyond
          rated resistance, magnetism and unauthorised servicing are excluded.
        </p>
      </PolicySection>

      <PolicySection title="7. Website use">
        <p>
          Content on this site — photography, copy, guides and the WatchGuru Atelier identity —
          is owned by WatchGuru. You may not scrape, reproduce or resell any of it. Product
          imagery is illustrative; minor cosmetic variance between the photograph and the
          finished piece is a characteristic of hand-assembly, not a defect.
        </p>
      </PolicySection>

      <PolicySection title="8. Liability and law">
        <p>
          To the fullest extent permitted by law, WatchGuru’s liability is limited to the price
          paid for the relevant order. We are not liable for consequential loss (e.g., missed
          events, lost time) arising from delayed delivery. These terms are governed by the laws
          of the Islamic Republic of Pakistan, with exclusive jurisdiction in the courts of
          Islamabad.
        </p>
      </PolicySection>

      <PolicySection title="9. Contact">
        <p>
          Questions about these terms? Email legal@watchguru.pk or WhatsApp +92 322 2242389,
          9am–9pm PKT. Continued use of the site after changes take effect constitutes
          acceptance.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}
