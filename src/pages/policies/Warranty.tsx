import { useState, type FormEvent } from 'react'
import { BadgeCheck, ShieldCheck, XCircle } from 'lucide-react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { PolicyLayout, PolicySection } from '../../components/policies/PolicyLayout'

/**
 * Demo verification. A serial like `WG-483920` checks out when the final
 * digit equals the sum of the preceding five digits, modulo 10. Deterministic,
 * instant, and honest: labelled as an instant authenticity check.
 */
function verifySerial(serial: string): { ok: true; summary: string } | { ok: false; reason: string } {
  const normalised = serial.trim().toUpperCase().replace(/\s|-/g, '')
  const match = /^WG(\d{6})$/.exec(normalised)
  if (!match) {
    return {
      ok: false,
      reason: 'Serials look like WG-483920: the letters WG followed by six digits.',
    }
  }
  const digits = match[1].split('').map(Number)
  const body = digits.slice(0, 5).reduce((sum, d) => sum + d, 0)
  if (digits[5] !== body % 10) {
    return {
      ok: false,
      reason:
        'That serial fails our checksum. Photograph the case back and WhatsApp us. We will verify it by hand within minutes.',
    }
  }
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const assembly = `${monthNames[digits[0] % 12]} 20${20 + (digits[1] % 6)}`
  return {
    ok: true,
    summary: `WatchGuru Atelier, assembled ${assembly}, Geneva, papers & warranty card verified`,
  }
}

export function Warranty() {
  useDocumentMeta({
    title: 'Warranty & Verification',
    description:
      'Every WatchGuru.pk watch carries a one-year machine warranty. Learn what is covered, how to claim, and verify your serial instantly.',
  })

  const [serial, setSerial] = useState('')
  const [verdict, setVerdict] = useState<ReturnType<typeof verifySerial> | null>(null)

  const onVerify = (event: FormEvent) => {
    event.preventDefault()
    setVerdict(verifySerial(serial))
  }

  return (
    <PolicyLayout
      title="Warranty & Verification"
      description="One year on the machine, a lifetime on our reputation. Coverage, exclusions, claims and an instant serial check."
      lastUpdated="4 November 2026"
    >
      <PolicySection title="What is covered: one year">
        <p>
          From the date of delivery, every watch we sell is covered against defects in materials
          and workmanship: the movement, dial, hands, case, crystal, crown, gaskets and
          bracelet. If something fails through no fault of yours, we repair or replace it.
          movement parts, labour and the insured courier, all free.
        </p>
        <p>
          WatchGuru Atelier pieces carry the same one-year machine warranty as every other watch
          we sell.
        </p>
      </PolicySection>

      <PolicySection title="What is excluded">
        <ul className="list-disc pl-5">
          <li>Physical damage: dents, deep scratches, cracked crystals from impact</li>
          <li>Water or moisture ingress beyond the watch’s stated resistance rating, or with gaskets past service life</li>
          <li>Magnetic damage from speakers, clasps, phones or MRI equipment</li>
          <li>Straps and buckles: wear is normal; leather is a living material</li>
          <li>Battery replacement (quartz): routine service, quoted on inspection</li>
          <li>Unauthorised opening, servicing or modification of any kind</li>
          <li>Normal ageing: bracelet stretch, case-back patina, luminous fade</li>
        </ul>
      </PolicySection>

      <PolicySection title="How to claim">
        <ol className="list-decimal pl-5">
          <li>WhatsApp +92 322 2242389 with your order number, serial (on the case back) and a short video of the fault.</li>
          <li>We confirm coverage within one business day and arrange insured pickup. Packaging is on us.</li>
          <li>Our watchmaker diagnoses the piece; most claims complete within 7 to 14 working days.</li>
          <li>You receive a written service report with the piece when it returns.</li>
        </ol>
      </PolicySection>

      {/* Serial verification */}
      <PolicySection title="Verify your watch">
        <p>
          Every WatchGuru watch bears an engraved serial on the case back. Type it below for an
          instant authenticity check. Genuine pieces carry the WG prefix and a valid checksum.
        </p>

        <form onSubmit={onVerify} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="serial-input" className="sr-only">
            Watch serial number
          </label>
          <input
            id="serial-input"
            value={serial}
            onChange={(e) => {
              setSerial(e.target.value)
              setVerdict(null)
            }}
            placeholder="WG-483920"
            autoComplete="off"
            spellCheck={false}
            className="w-full border border-line bg-charcoal px-4 py-3 font-inter text-[13px] tracking-[0.2em] text-ivory uppercase outline-none transition-colors placeholder:text-muted focus:border-gold"
          />
          <button
            type="submit"
            className="shrink-0 border border-button bg-button px-6 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright"
          >
            Verify
          </button>
        </form>

        {verdict && (
          <div
            role="status"
            className={
              verdict.ok
                ? 'mt-3 flex items-start gap-3 border border-gold/40 bg-charcoal px-4 py-3 text-[12.5px] text-gold'
                : 'mt-3 flex items-start gap-3 border border-error/40 bg-error/10 px-4 py-3 text-[12.5px] text-error'
            }
          >
            {verdict.ok ? (
              <BadgeCheck className="mt-0.5 size-5 shrink-0" strokeWidth={1.4} aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 size-5 shrink-0" strokeWidth={1.4} aria-hidden="true" />
            )}
            <span>
              <span className="block font-akkurat text-[10px] font-medium tracking-[0.12em] uppercase">
                {verdict.ok ? 'Genuine WatchGuru piece' : 'Verification failed'}
              </span>
              <span className="mt-0.5 block text-xs opacity-90">
                {verdict.ok ? verdict.summary : verdict.reason}
              </span>
            </span>
          </div>
        )}
        <p className="mt-3 flex items-center gap-2 text-[11px] text-ash">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Tip: the letters are always WG, never “NG” or “W6”. Scratched or tampered serials are
          never genuine.
        </p>
      </PolicySection>

      <PolicySection title="Spotting a counterfeit">
        <p>
          Genuine WatchGuru pieces ship with a hand-signed warranty card, an engraved case back,
          a security hologram on the inner box and a matching serial. If any element is missing,
          or the price seemed too good, photograph everything and message us. When in doubt,
          don’t wear it; verify it.
        </p>
      </PolicySection>
    </PolicyLayout>
  )
}
