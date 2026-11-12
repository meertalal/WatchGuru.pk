import { useState, type FormEvent } from 'react'
import { BadgeCheck, Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { useDocumentMeta } from '../../hooks/useDocumentMeta'
import { errorMessage } from '../../lib/api'
import { formatDate } from '../../lib/format'
import {
  verifyWarrantySerial,
  type WarrantyResult,
} from '../../data/repositories/supportRepository'
import { PolicyLayout, PolicySection } from '../../components/policies/PolicyLayout'

type Verdict = { ok: true; result: WarrantyResult } | { ok: false; reason: string }

export function Warranty() {
  useDocumentMeta({
    title: 'Warranty & Verification',
    description:
      'Every WatchGuru.pk watch carries a one-year machine warranty. Learn what is covered, how to claim, and verify your serial instantly.',
  })

  const [serial, setSerial] = useState('')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [checking, setChecking] = useState(false)

  const onVerify = async (event: FormEvent) => {
    event.preventDefault()
    const value = serial.trim()

    if (!value) {
      setVerdict({ ok: false, reason: 'Enter the serial engraved on the case back.' })
      return
    }

    setChecking(true)
    setVerdict(null)

    try {
      setVerdict({ ok: true, result: await verifyWarrantySerial(value) })
    } catch (error) {
      setVerdict({
        ok: false,
        reason: errorMessage(
          error,
          'That serial could not be verified right now. Please try again shortly.',
        ),
      })
    } finally {
      setChecking(false)
    }
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
          Every WatchGuru watch bears an engraved serial on the case back. Type it below to check it
          against our warranty registry. Serials look like WG-2026-1001.
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
            placeholder="WG-2026-1001"
            autoComplete="off"
            spellCheck={false}
            className="w-full border border-line bg-charcoal px-4 py-3 font-inter text-[13px] tracking-[0.2em] text-ivory uppercase outline-none transition-colors placeholder:text-muted focus:border-gold"
          />
          <button
            type="submit"
            disabled={checking}
            className="inline-flex shrink-0 items-center justify-center gap-2 border border-button bg-button px-6 py-3 font-akkurat text-[10px] font-medium tracking-[0.2em] text-button-text uppercase transition-colors hover:border-gold-bright hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-60"
          >
            {checking && <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />}
            {checking ? 'Checking…' : 'Verify'}
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
                {verdict.ok
                  ? `Serial ${verdict.result.serial} is registered to WatchGuru.pk. Verified ${formatDate(verdict.result.verifiedAt)}.`
                  : verdict.reason}
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
