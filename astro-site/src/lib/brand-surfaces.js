/**
 * Hero / services section overlays — navy aligned with logo & theme `primary` (~#0A2351).
 */

export const HERO_OVERLAY_GRADIENT =
  'linear-gradient(135deg, rgba(10, 35, 81, 0.88) 0%, rgba(10, 35, 81, 0.84) 50%, rgba(10, 35, 81, 0.88) 100%)'

const SERVICES_SOLID_BG = '#071a3d'
const SERVICES_OVERLAY_GRADIENT =
  'linear-gradient(135deg, rgba(10, 35, 81, 0.94) 0%, rgba(8, 50, 110, 0.94) 100%)'

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
