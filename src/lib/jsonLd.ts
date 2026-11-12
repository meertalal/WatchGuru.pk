/**
 * Serialize structured data for a `<script type="application/ld+json">` block.
 *
 * `JSON.stringify` does not escape `<`, `>` or `&`, so a catalogue value such
 * as `</script><script>…` could break out of the surrounding tag. Escaping
 * those characters (plus the JS line separators) keeps the payload inert while
 * remaining valid JSON for search engines.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}
