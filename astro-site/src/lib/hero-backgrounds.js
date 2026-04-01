import { asStr } from './sanity-strings.js'

/** Rotating hero images under `Media (AAGF)/Images (AAGF)/` (sync via `npm run sync:media`). */
const HERO_POOL = [
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-copper-gutter-front-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-apollo-beach-fl-downspout-drainage.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-apollo-beach-fl-gutter-installation-residential-2.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-apollo-beach-fl-side-yard-drainage.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-front-entry-gutters.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-gutter-system-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-seamless-gutter-installation-front-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-second-story-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-side-yard-downspout.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-brandon-fl-white-gutter-downspout.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-clearwater-downspout-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-clearwater-fl-black-gutters-modern-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-clearwater-fl-downspout-detail.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-clearwater-fl-modern-home-black-gutters.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-lakeland-fl-roof-gutter-system.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-lutz-fl-copper-gutters-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-lutz-fl-residential-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-lutz-fl-white-downspout-detail.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-plant-city-fl-brick-home-gutters.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-plant-city-fl-gutter-corner-drainage.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-plant-city-fl-townhome-gutter-system.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-black-gutter-downspout.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-copper-gutter-system.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-corner-downspout.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-downspout-drainage-rock-bed.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-downspout-installation-white-gutter-drainage.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-downspout-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-riverview-fl-white-gutter-install-two-story-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-st-petersburg-fl-white-gutter-side-yard.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-backyard-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-copper-gutter-installation 2.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-copper-gutter-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-downspout-installation-side-yard-drainage.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-entryway-gutter-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-front-elevation-gutter-install-stone-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-front-porch-gutter-installation-seamless-brandon-fl-2.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-garage-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-gutter-and-downspout-installation-home.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-modern-home-black-gutters.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-residential-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-screened-patio-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-seamless-gutter-installation-brandon-fl.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-stone-home-downspout.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-townhome-gutter-install.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-tampa-townhome-gutter-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-valrico-fl-aluminum-gutter-system-backyard.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-valrico-fl-bay-window-gutter-system.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-valrico-fl-two-story-gutter-installation.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-wesley-chapel-fl-downspout-detail.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-wesley-chapel-fl-screen-enclosure-gutters.webp',
  'Media (AAGF)/Images (AAGF)/sunlife-gutters-wesley-chapel-fl-screened-patio-gutters.webp',
]

function seedIndex(seed) {
  const s = asStr(seed)
  let hash = 0
  for (let i = 0; i < s.length; i += 1) hash = (hash * 31 + s.charCodeAt(i)) >>> 0
  return HERO_POOL.length ? hash % HERO_POOL.length : 0
}

export function heroBackgroundFor(seed) {
  if (!HERO_POOL.length) return ''
  return HERO_POOL[seedIndex(seed)]
}
