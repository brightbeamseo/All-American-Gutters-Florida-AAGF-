/**
 * Homepage marketing copy: prefer "South Florida" over Tampa / Tampa Bay.
 * Skips strings that look like street addresses or "City, FL" location lines.
 *
 * @param {unknown} text
 * @param {string} [addressShort] siteSettings.business.addressShort — never rewrite if embedded
 * @returns {string}
 */
export function southFloridaCopy(text, addressShort = '') {
  const s = text == null ? '' : String(text)
  if (!s.trim()) return s

  const addr = String(addressShort || '').trim()
  if (addr && s.includes(addr)) return s

  const t = s.trim()
  if (new RegExp(',\\s*FL\\s*$', 'i').test(t)) return s
  if (
    /\b\d{5}\b/.test(s) &&
    new RegExp('(Ave|St\\.?|Street|Road|Rd\\.?|Dr\\.?|Drive|Blvd|Lenna|Suite|Ste\\.?)', 'i').test(s)
  ) {
    return s
  }

  let out = s.replace(new RegExp('Tampa\\s+Bay', 'gi'), 'South Florida')
  out = out.replace(new RegExp('\\bTampa\\b', 'gi'), 'South Florida')
  return out
}

/**
 * @param {unknown} svc
 * @returns {boolean}
 */
export function isHomeGuttersServiceItem(svc) {
  const title = String(svc?.title ?? '').toLowerCase()
  if (!title.trim()) return false
  if (title.includes('soffit') || title.includes('fascia')) return true
  if (title.includes('screen') || title.includes('lanai')) return false
  if (title.includes('siding')) return false
  if (title.includes('drainage') && !title.includes('gutter')) return false
  return title.includes('gutter')
}
