/**
 * Shared site logo (header + footer). Override CMS horizontal logos until final assets ship.
 */
import { mediaUrl } from './sanity-strings.js'

export const AAGF_SITE_LOGO_REL =
  'Media (AAGF)/Logo Suite (AAGF)/all-american-gutters-logo-placeholder.jpg'

export function aagfSiteLogoUrl() {
  return mediaUrl(AAGF_SITE_LOGO_REL)
}
