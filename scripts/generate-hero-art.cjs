/**
 * WatchGuru.pk — widescreen hero artwork (1600x900) derived from the same
 * spec-driven renderer as the product shots. Three compositions.
 *
 * Run: node scripts/generate-hero-art.cjs
 */
const fs = require('fs')
const path = require('path')
const { parseSeed, renderProduct } = require('./generate-watch-art.cjs')

const OUT_DIR = 'D:/laragon/www/guru-watch/public/heroes'

const HEROES = [
  { slug: 'watchguru-atelier-wg01-heritage-auto', file: '2026-collection.svg' },
  { slug: 'beaumont-monarch-perpetual', file: 'executive.svg' },
  { slug: 'watchguru-atelier-wg02-chronosport-42', file: 'cod.svg' },
]

function heroBackdrop() {
  return `
  <rect width="1600" height="900" fill="url(#heroBg)"/>
  <circle cx="1180" cy="450" r="560" fill="none" stroke="#c69a52" stroke-opacity="0.10" stroke-width="1.4"/>
  <circle cx="1180" cy="450" r="470" fill="none" stroke="#c69a52" stroke-opacity="0.16" stroke-width="1"/>
  <circle cx="1180" cy="450" r="380" fill="none" stroke="#c69a52" stroke-opacity="0.22" stroke-width="1"/>
  <circle cx="1180" cy="450" r="285" fill="none" stroke="#c69a52" stroke-opacity="0.14" stroke-width="20"/>
  <rect x="0" y="0" width="760" height="900" fill="url(#leftFade)"/>`
}

function heroSvg(spec) {
  // Strip the product SVG down to its inner artwork, then re-centre it on a wide canvas.
  const productSvg = renderProduct(spec, { strapless: true, cx: 400, cy: 500, caseR: 168, dialR: 128 })
  const inner = productSvg.match(/<g filter="url\(#soft\)">[\s\S]*?<\/g>/)
  const defsMatch = productSvg.match(/<defs>[\s\S]*?<\/defs>/)
  if (!inner || !defsMatch) throw new Error('could not decompose product artwork for', spec.slug)

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="${spec.brand} ${spec.name} — hero artwork">
  <defs>
    <radialGradient id="heroBg" cx="72%" cy="46%" r="80%">
      <stop offset="0%" stop-color="#1a1815"/>
      <stop offset="45%" stop-color="#100f0d"/>
      <stop offset="100%" stop-color="#080808"/>
    </radialGradient>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#080808" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#080808" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#080808" stop-opacity="0"/>
    </linearGradient>
    ${defsMatch[0].replace(/<\/?defs>/g, '')}
  </defs>
  ${heroBackdrop()}
  <g transform="translate(1235 450) scale(2.05) translate(-400 -500)">${inner[0]}</g>
  <text x="80" y="838" fill="#c69a52" fill-opacity="0.55" font-family="Montserrat, sans-serif" font-size="10" letter-spacing="5">WATCHGURU.PK</text>
</svg>`
}

fs.mkdirSync(OUT_DIR, { recursive: true })
const specs = parseSeed()
for (const hero of HEROES) {
  const spec = specs.find((s) => s.slug === hero.slug)
  if (!spec) throw new Error('seed spec not found: ' + hero.slug)
  fs.writeFileSync(path.join(OUT_DIR, hero.file), heroSvg(spec))
  console.log('rendered hero', hero.file)
}
