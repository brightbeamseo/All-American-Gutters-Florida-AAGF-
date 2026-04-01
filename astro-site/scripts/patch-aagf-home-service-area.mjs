#!/usr/bin/env node
/**
 * South Florida `locationPage` set: slugs are always `gutters-{city}-fl` (public URLs `/gutters-...-fl/`).
 * Replaces copy, syncs `homePageSingleton.serviceArea` city links to those URLs, and removes any other
 * `locationPage` documents (legacy Tampa / west-central FL and old slug shapes).
 *
 * Run: cd astro-site && npm run content:aagf:service-area
 * (Also runs as part of `npm run content:aagf`.)
 */

import { createClient } from '@sanity/client'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSanityPatchCredentials, loadPatchDotEnv, tryPublishDraft } from './patch-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

loadPatchDotEnv(root)

const { projectId, dataset, token } = getSanityPatchCredentials()

/** Display names for the homepage city nav (order matches LOCATIONS). */
const CITY_LABELS = [
  'Deerfield Beach',
  'Boca Raton',
  'Fort Lauderdale',
  'Pompano Beach',
  'Delray Beach',
  'Boynton Beach',
  'Coral Springs',
  'West Palm Beach',
  'Hollywood',
  'Palm Beach Gardens',
]

/**
 * @typedef {{ slug: string; title: string; headline: string; lead: string; seoDescription: string }} LocDef
 * @type {LocDef[]}
 */
const LOCATIONS = [
  {
    slug: 'gutters-deerfield-beach-fl',
    title: 'Gutter installation & repair in Deerfield Beach, FL',
    headline: 'Gutter company serving Deerfield Beach',
    lead: 'We are based in Deerfield Beach and install seamless gutters, repair storm-damaged runs, add gutter guards, and tune downspouts for South Florida rainfall. Same-day calls, clear estimates, and crews focused on clean water management away from your foundation.',
    seoDescription:
      'Deerfield Beach gutter installation, repair, and gutter guards. All American Gutters—local South Florida team, free estimates.',
  },
  {
    slug: 'gutters-boca-raton-fl',
    title: 'Gutter installation & repair in Boca Raton, FL',
    headline: 'Gutters & guards for Boca Raton homes',
    lead: 'Boca Raton properties get measured installs, leak repairs, and guard systems that cut debris buildup. We plan overflow paths for summer downpours and coastal wind-driven rain.',
    seoDescription:
      'Boca Raton, FL seamless gutters, repairs, and gutter guards. All American Gutters serves Palm Beach County from Deerfield Beach.',
  },
  {
    slug: 'gutters-fort-lauderdale-fl',
    title: 'Gutter installation & repair in Fort Lauderdale, FL',
    headline: 'Fort Lauderdale gutter installation & repair',
    lead: 'From downtown to the suburbs, we replace failing sections, re-pitch sagging lines, and secure hangers so your Fort Lauderdale roofline drains reliably through the rainy season.',
    seoDescription:
      'Fort Lauderdale gutter services: installation, replacement, and repair. Seamless gutters and guards—All American Gutters.',
  },
  {
    slug: 'gutters-pompano-beach-fl',
    title: 'Gutter installation & repair in Pompano Beach, FL',
    headline: 'Pompano Beach seamless gutters',
    lead: 'Pompano Beach homeowners call us for new seamless systems, corner leak fixes, and downspout extensions that keep pooling off patios, driveways, and pool decks.',
    seoDescription:
      'Pompano Beach, FL gutter installation and repair. Gutter guards and downspouts—All American Gutters in Broward County.',
  },
  {
    slug: 'gutters-delray-beach-fl',
    title: 'Gutter installation & repair in Delray Beach, FL',
    headline: 'Delray Beach gutter & downspout service',
    lead: 'Delray Beach sees intense bursts of rain; we size gutters and outlets for your roof area, add guards where trees shed, and repair separation at fascia boards.',
    seoDescription:
      'Delray Beach gutter installation, repair, and guards. Palm Beach County service from All American Gutters.',
  },
  {
    slug: 'gutters-boynton-beach-fl',
    title: 'Gutter installation & repair in Boynton Beach, FL',
    headline: 'Boynton Beach gutter specialists',
    lead: 'Boynton Beach installs include hidden hanger systems, color-matched aluminum, and drainage planning for slab and landscaping protection after heavy storms.',
    seoDescription:
      'Boynton Beach, FL gutters: seamless install, repair, replacement. Free estimates from All American Gutters.',
  },
  {
    slug: 'gutters-coral-springs-fl',
    title: 'Gutter installation & repair in Coral Springs, FL',
    headline: 'Coral Springs gutters done right',
    lead: 'Coral Springs homes benefit from straight runs, properly placed downspouts, and guards that reduce ladder work. We fix overflows, loose spikes, and separated joints.',
    seoDescription:
      'Coral Springs gutter installation and repair. Broward County—All American Gutters, seamless systems and guards.',
  },
  {
    slug: 'gutters-west-palm-beach-fl',
    title: 'Gutter installation & repair in West Palm Beach, FL',
    headline: 'West Palm Beach gutter services',
    lead: 'We work throughout West Palm Beach for full replacements, partial repairs, and gutter protection upgrades—keeping soffit, siding, and foundations drier year-round.',
    seoDescription:
      'West Palm Beach, FL gutter installation & repair. Seamless gutters and guards—All American Gutters.',
  },
  {
    slug: 'gutters-hollywood-fl',
    title: 'Gutter installation & repair in Hollywood, FL',
    headline: 'Hollywood (FL) gutter installation',
    lead: 'Hollywood properties in Broward get responsive service for leaks, pulled-away gutters, and clogged systems. We align pitch, seal corners, and improve outlet flow.',
    seoDescription:
      'Hollywood, Florida gutter installation and repair. All American Gutters—South Florida local crew.',
  },
  {
    slug: 'gutters-palm-beach-gardens-fl',
    title: 'Gutter installation & repair in Palm Beach Gardens, FL',
    headline: 'Palm Beach Gardens gutter company',
    lead: 'Palm Beach Gardens communities trust us for polished installs that match rooflines, plus maintenance-friendly guard options and storm-season tune-ups.',
    seoDescription:
      'Palm Beach Gardens, FL gutters: installation, repair, guards. All American Gutters—free estimates.',
  },
]

const SERVICE_AREA = {
  eyebrow: 'Where we work',
  headline: 'South Florida service area',
  intro:
    'We operate from Deerfield Beach and serve Broward and Palm Beach counties. The cities below link to local pages for gutter installation, repair, guards, and downspouts—call us for a free estimate anywhere in our South Florida service area.',
  mapIframeTitleTemplate: '{{companyName}} South Florida service map',
  citiesLabel: 'South Florida communities',
  citiesNavAriaLabel: 'Broward and Palm Beach area cities we serve',
}

/** Stable Sanity document id per slug (no random UUID drift). */
function docIdForSlug(slug) {
  return `aagf-loc-${slug}`
}

async function main() {
  if (!projectId || !token) {
    console.error(
      'Missing Sanity credentials: set PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID, and SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN (repo-root or astro-site/.env).',
    )
    process.exit(1)
  }

  if (LOCATIONS.length !== CITY_LABELS.length) {
    throw new Error('LOCATIONS and CITY_LABELS length mismatch')
  }

  const keepSlugs = new Set(LOCATIONS.map((l) => l.slug))

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  for (const loc of LOCATIONS) {
    const _id = docIdForSlug(loc.slug)
    await client.createOrReplace({
      _id,
      _type: 'locationPage',
      title: loc.title,
      slug: { _type: 'slug', current: loc.slug },
      seoDescription: loc.seoDescription,
      eyebrow: 'South Florida gutters',
      headline: loc.headline,
      lead: loc.lead,
      contentSections: [],
    })
    console.log(`Upserted locationPage ${_id} → ${loc.slug}`)
    const pubId = _id.replace(/^drafts\./, '')
    if (await tryPublishDraft(client, pubId)) {
      console.log(`Published draft for ${pubId}.`)
    }
  }

  const allLocs = await client.fetch(`*[_type == "locationPage"]{ _id, "slug": slug.current }`)
  for (const row of Array.isArray(allLocs) ? allLocs : []) {
    const s = typeof row?.slug === 'string' ? row.slug : ''
    const id = typeof row?._id === 'string' ? row._id : ''
    if (!s || keepSlugs.has(s)) continue
    try {
      await client.delete(id)
      console.log(`Deleted legacy locationPage ${id} (slug ${s}).`)
    } catch (err) {
      console.warn(`Could not delete ${id} (${s}): ${err?.message || err}`)
    }
  }

  const prev = await client.fetch(
    `*[_id == "homePageSingleton"][0]{ "mapEmbedUrlKey": serviceArea.mapEmbedUrlKey, "oldCities": serviceArea.cities }`,
  )
  const mapEmbedUrlKey =
    typeof prev?.mapEmbedUrlKey === 'string' && prev.mapEmbedUrlKey.trim() !== ''
      ? prev.mapEmbedUrlKey.trim()
      : 'siteMapEmbed'

  const oldCities = Array.isArray(prev?.oldCities) ? prev.oldCities : []
  const cities = LOCATIONS.map((loc, i) => {
    const href = `/${loc.slug}/`
    const base = {
      _type: 'cityLink',
      name: CITY_LABELS[i],
      href,
    }
    const k = oldCities[i]?._key
    return k ? { ...base, _key: k } : base
  })

  if (oldCities.length && oldCities.length !== LOCATIONS.length) {
    console.warn(
      `Previous serviceArea had ${oldCities.length} cities; replacing with ${LOCATIONS.length}. Studio array keys may change for excess rows.`,
    )
  }

  await client
    .patch('homePageSingleton')
    .set({
      'serviceArea.eyebrow': SERVICE_AREA.eyebrow,
      'serviceArea.headline': SERVICE_AREA.headline,
      'serviceArea.intro': SERVICE_AREA.intro,
      'serviceArea.mapEmbedUrlKey': mapEmbedUrlKey,
      'serviceArea.mapIframeTitleTemplate': SERVICE_AREA.mapIframeTitleTemplate,
      'serviceArea.citiesLabel': SERVICE_AREA.citiesLabel,
      'serviceArea.citiesNavAriaLabel': SERVICE_AREA.citiesNavAriaLabel,
      'serviceArea.cities': cities,
    })
    .commit()

  console.log(
    `Patched homePageSingleton → serviceArea (${LOCATIONS.length} cities, hrefs /gutters-…-fl/).`,
  )

  if (await tryPublishDraft(client, 'homePageSingleton')) {
    console.log('Published homePageSingleton (draft → live).')
  } else {
    console.log('No draft for homePageSingleton; public API may already reflect the patch.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
