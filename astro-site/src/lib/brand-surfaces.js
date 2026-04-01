/**
 * Hero / services section overlays — navy aligned with logo & theme `primary` (~#0E407D).
 */

export const HERO_OVERLAY_GRADIENT =
  'linear-gradient(135deg, rgba(14, 64, 125, 0.88) 0%, rgba(14, 64, 125, 0.84) 50%, rgba(14, 64, 125, 0.88) 100%)'

const SERVICES_SOLID_BG = '#061a32'
const SERVICES_OVERLAY_GRADIENT =
  'linear-gradient(135deg, rgba(14, 64, 125, 0.94) 0%, rgba(10, 52, 102, 0.94) 100%)'

/**
 * @param {string} imageUrl Result of mediaUrl(...) for the hero image
 */
export function inlineHeroBgStyle(imageUrl) {
  return `background-image: ${HERO_OVERLAY_GRADIENT}, url("${imageUrl}"); background-size: cover; background-position: center; background-repeat: no-repeat;`
}

/**
 * @param {string} imageUrl Result of mediaUrl(...) for the services strip image
 */
export function inlineServicesBgStyle(imageUrl) {
  return `background-color: ${SERVICES_SOLID_BG}; background-image: ${SERVICES_OVERLAY_GRADIENT}, url("${imageUrl}"); background-size: cover; background-position: center; background-repeat: no-repeat;`
}
