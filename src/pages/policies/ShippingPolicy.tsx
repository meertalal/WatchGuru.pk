import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { PolicyLayout, PolicySection } from '../../components/policies/PolicyLayout'
import { COD_ADVANCE_PKR } from '../../lib/orders'

export function ShippingPolicy() {
  useDocumentMeta({
    title: 'Shipping Policy',
    description:
      'Free insured delivery nationwide in 2 to 5 business days, Cash on Delivery with a Rs. 1,000 confirmation advance, tracked end-to-end.',
  })

  return (
    <PolicyLayout
      title="Shipping Policy"
      description="Free, insured and signature on delivery, everywhere in Pakistan. Here is exactly how your watch travels."
      lastUpdated="4 November 2026"
    >
      <PolicySection title="Delivery coverage">
        <p>
          We deliver to all cities of Pakistan, including Karachi, Lahore, Islamabad,
          Rawalpindi, Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, Hyderabad and
          Abbottabad, as well as Gilgit-Baltistan and Azad Jammu &amp; Kashmir. Remote areas may
          take one extra working day.
        </p>
      </PolicySection>

      <PolicySection title="Timelines">
        <ul className="list-disc pl-5">
          <li>Dispatch: within 24 to 48 hours of your order confirmation call</li>
          <li>Major cities (Karachi, Lahore, Islamabad/Rawalpindi): 2 to 3 business days</li>
          <li>All other cities: 3 to 5 business days</li>
          <li>Gilgit-Baltistan &amp; AJK: 4 to 6 business days</li>
        </ul>
        <p>
          Every parcel is dispatched with end-to-end insurance and a mandatory signature on
          delivery. This is non-negotiable. Your watch never travels uninsured.
        </p>
      </PolicySection>

      <PolicySection title="Shipping charges">
        <p>
          Delivery is <strong>free</strong> on every order, anywhere in Pakistan, no minimum
          spend, no fine print. The price you see is the price you pay, duties included.
        </p>
      </PolicySection>

      <PolicySection title="Cash on Delivery (COD)">
        <p>
          COD is available nationwide. To protect both of us from non-serious orders, COD orders
          require a <strong>Rs. {COD_ADVANCE_PKR.toLocaleString('en-PK')} advance</strong>, paid via
          Easypaisa, JazzCash or bank transfer after your confirmation call. That amount is
          adjusted against your bill on delivery. You never pay extra.
        </p>
        <p>
          If you refuse the parcel without a valid reason, the advance is forfeited to cover
          insurance, packaging and logistics. If your order is cancelled before dispatch, or we
          fail to deliver, the advance is refunded in full within five to seven working days.
        </p>
      </PolicySection>

      <PolicySection title="Other payment methods">
        <p>
          Advance via Easypaisa, JazzCash or bank transfer confirms your order immediately and
          locks in the price you saw, even if the watch sells out afterwards. Our team shares the
          account details on WhatsApp right after checkout; your watch is dispatched the moment
          the advance reflects.
        </p>
      </PolicySection>

      <PolicySection title="Tracking & packaging">
        <p>
          You receive a tracking link the moment your parcel leaves our facility. Every order is
          packed in a tamper-evident, double-boxed, insured package with the watch fixed in a
          fitted cradle. The same care, whether it is a first automatic or a grand complication.
        </p>
      </PolicySection>

      <PolicySection title="Questions while in transit">
        <p>
          If tracking has not updated within 48 hours of dispatch, message us on WhatsApp
          (+92 322 2242389) with your order number. We will nudge the courier partner and keep
          you posted. For address corrections before dispatch, call immediately; after dispatch,
          corrections follow the courier’s redirection policy.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}
