import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { PolicyLayout, PolicySection } from '../../components/policies/PolicyLayout'
import { COD_ADVANCE_PKR } from '../../lib/orders'

export function RefundPolicy() {
  useDocumentMeta({
    title: 'Refund & Exchange Policy',
    description:
      'Seven-day returns and exchanges, insured courier both ways, refunds within 5 to 7 working days. The WatchGuru.pk refund and exchange policy.',
  })

  return (
    <PolicyLayout
      title="Refund & Exchange Policy"
      description="Seven days, insured both ways, and a human being you can actually reach. Here is exactly how returns and exchanges work."
      lastUpdated="4 November 2026"
    >
      <PolicySection title="The seven-day promise">
        <p>
          From the date your watch is delivered, you have <strong>seven (7) calendar days</strong> to
          request a return or exchange. Your watch must be unworn, with all protective seals,
          tags, warranty cards, instruction manuals, the outer box, the inner box and the
          original invoice intact. A watch returned without its seals or paperwork will be
          inspected and may be declined.
        </p>
      </PolicySection>

      <PolicySection title="What is eligible">
        <p>
          <strong>Eligible:</strong> manufacturing defects (movement stopping, uneven hands,
          moisture under the crystal, bracelet faults), wrong item dispatched, or a change of
          mind within the seven-day window, for unused pieces only.
        </p>
        <p>
          <strong>Not eligible:</strong> scratches or dents after the first 48 hours of wear,
          water damage beyond the watch’s stated resistance, magnetic damage, strap wear from
          perspiration or perfume, damage from unauthorised opening or servicing, and final-sale
          engraved pieces (names or dates engraved at your request).
        </p>
      </PolicySection>

      <PolicySection title="How to start a return">
        <ol className="list-decimal pl-5">
          <li>Message us on WhatsApp (+92 322 2242389) or email care@watchguru.pk with your order number and photos of the watch and its seals.</li>
          <li>Our team reviews the request. Most are approved within one business day.</li>
          <li>We arrange an insured courier pickup or share a drop-off point, whichever is faster for you. Packaging is on us.</li>
          <li>On arrival, our watchmaker inspects the piece within 48 hours.</li>
          <li>Approved refunds are paid within five to seven working days to your original payment method (COD orders are refunded via bank transfer or Easypaisa/JazzCash).</li>
        </ol>
      </PolicySection>

      <PolicySection title="Exchanges">
        <p>
          Prefer a different size, dial or strap? An exchange is a return plus a new order,
          but we waive one way of courier fees and honour the price you originally paid, even if
          the new piece has since increased. Strap-only swaps (where offered) are also covered
          within seven days, subject to stock.
        </p>
      </PolicySection>

      <PolicySection title="The Cash on Delivery advance">
        <p>
          The Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')} confirmation advance is adjusted in
          full against your delivered order, so it is never an extra cost. If you refuse a
          parcel without a valid defect, the advance is forfeited to cover packaging, insurance
          and logistics. If we dispatch the wrong piece or it fails verification, your advance is
          refunded in full within five to seven working days.
        </p>
      </PolicySection>

      <PolicySection title="Refund timelines at a glance">
        <ul className="list-disc pl-5">
          <li>Approval decision: within 1 business day of inspection (usually same day)</li>
          <li>Bank / Easypaisa / JazzCash refunds: 5 to 7 working days</li>
          <li>Debit / credit card refunds (via bank transfer partner): 7 to 14 working days, issuer-dependent</li>
          <li>Exchanges: dispatched the same day the returned piece clears inspection</li>
        </ul>
      </PolicySection>
    </PolicyLayout>
  )
}
