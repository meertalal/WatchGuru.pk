import type { Product } from '../types'

/**
 * Builds the "Materials & Care" guide for a product from its own spec —
 * no per-product copy to maintain, no fabricated promises.
 */

export interface CareSection {
  title: string
  body: string
}

export function materialsAndCare(product: Product): CareSection[] {
  const sections: CareSection[] = []

  sections.push({
    title: `Case — ${product.caseMaterial}`,
    body: caseCare(product.caseMaterial),
  })

  sections.push({
    title: `Strap — ${product.strapType}`,
    body: strapCare(product.strapType),
  })

  sections.push({
    title: 'Crystal & dial',
    body: 'Wipe the crystal with a dry microfibre cloth only. Avoid household glass cleaners — they strip anti-reflective coatings. If your dial features applied indices or pavé stones, refrain from ultrasonic cleaning.',
  })

  if (/automatic/i.test(product.movement)) {
    sections.push({
      title: 'Movement — automatic',
      body: 'Automatic calibres like to be worn. If left unworn for more than 48 hours, wind the crown 20–30 turns before setting the time. Avoid magnetic sources (speakers, handbag clasps, phone cases) and have the movement serviced every 4–5 years by an authorised WatchGuru service centre.',
    })
  } else if (/chrono/i.test(product.movement)) {
    sections.push({
      title: 'Movement — chronograph',
      body: 'Do not operate the chronograph pushers while the chronograph is running through its reset cycle underwater, and never force a pusher that resists. A column-wheel mechanism is precise but unforgiving of rough handling.',
    })
  } else {
    sections.push({
      title: 'Movement — quartz',
      body: 'Replace the battery every 3–5 years (or as indicated by an end-of-life seconds jump). A fresh battery prevents gasket compression loss, which protects the stated water resistance.',
    })
  }

  if (/gold|rose gold|18k/i.test(`${product.caseMaterial} ${product.strapType}`)) {
    sections.push({
      title: 'Precious metal',
      body: 'Gold is soft — avoid contact with abrasive surfaces, perfume and chlorine. Professional re-polishing once a year keeps the case and bracelet unmarked. Store the piece in the supplied leather pouch when not worn.',
    })
  }

  sections.push({
    title: 'Storage',
    body: 'Store your watch flat in its original box, away from direct sunlight, humidity and extreme temperatures. Magnetic clasps and scented drawer liners accelerate degradation — a plain wooden box is best.',
  })

  return sections
}

function caseCare(material: string): string {
  if (/gold|18k/i.test(material))
    return 'Rinse gently with lukewarm soapy water, dry with a soft cloth, and never use metal polish — it removes gold plating and softens hallmarked edges.'
  if (/ceramic/i.test(material))
    return 'Ceramic is scratch-proof but not shatter-proof. Avoid hard impacts and, after salt water exposure, rinse with fresh water and dry thoroughly.'
  if (/titanium/i.test(material))
    return 'Titanium is hypoallergenic and corrosion-proof. Clean with a damp cloth and mild soap; scratches require professional micro-bead refinishing.'
  if (/platinum/i.test(material))
    return 'Platinum develops a natural satin patina that collectors prize. Clean with warm soapy water and a lint-free cloth; refrain from abrasive pastes.'
  return 'Stainless steel is the workhorse of horology. Wipe daily with a microfibre cloth; for deeper cleaning use a soft brush with mild soap, then dry completely. Have the case re-polished professionally to remove hairline scratches.'
}

function strapCare(strap: Product['strapType']): string {
  switch (strap) {
    case 'Leather':
      return 'Keep leather away from water, perfume, sweat and direct sun. Wipe with a barely-damp cloth, condition twice a year with a leather balm, and rotate straps if worn daily. Expect a supple patina to develop — that is character, not wear.'
    case 'Gold':
      return 'Solid gold bracelets should be washed monthly with warm soapy water and a soft brush. Dry thoroughly and inspect pins annually.'
    case 'Rubber':
      return 'Rinse with fresh water after salt or chlorine exposure. Avoid sunscreen contact — oils degrade elastomers. Replace the strap every 2–3 years if worn hard.'
    case 'NATO Fabric':
      return 'NATO straps are washable — hand-wash in lukewarm water with mild soap, air-dry flat. Replace when the weave thins at the spring bars.'
    case 'Milanese Mesh':
      return 'Wipe the mesh with a dry cloth and steam-clean lightly once a season. Avoid bending the mesh sharply — it creases permanently.'
    case 'Stainless Steel':
    default:
      return 'Bracelets collect soap and skin residue — clean between links monthly with warm soapy water and a soft brush. Micro-adjust the clasp seasonally to preserve the bracelet\'s geometry.'
  }
}
