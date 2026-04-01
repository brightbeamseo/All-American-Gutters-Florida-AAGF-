#!/usr/bin/env node
/**
 * Writes All American Gutters business copy, contact, meta, keywords, and categories
 * into Sanity Site settings (singleton `siteSettingsSingleton`).
 *
 * Requires astro-site/.env:
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET (optional, default production)
 *   SANITY_API_WRITE_TOKEN
 *
 * Run: cd astro-site && npm run content:aagf (also runs patch-aagf-home-hero.mjs for Tampa/typo fixes)
 * Or this file only: node scripts/patch-aagf-business.mjs
 * Then Studio → Publish Site settings (+ Home page if hero was patched).
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadDotEnv() {
  const p = resolve(root, '.env')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadDotEnv()

const projectId = (process.env.PUBLIC_SANITY_PROJECT_ID || '').trim()
const dataset = (process.env.PUBLIC_SANITY_DATASET || 'production').trim()
const token = (process.env.SANITY_API_WRITE_TOKEN || '').trim()
const documentId = 'siteSettingsSingleton'

function stringListItems(values) {
  return values.map((value, i) => ({
    _type: 'stringListItem',
    _key: `aagf-${i}-${String(value).replace(/\s+/g, '-').slice(0, 24)}`,
    value: String(value).trim(),
  }))
}

const DESCRIPTION_SHORT =
  'All American Gutters installs and repairs seamless gutters, gutter guards, and downspouts for South Florida homes. Get a free estimate—local crew, quality work, and reliable service you can count on.'

const DESCRIPTION_LONG = `All American Gutters is a South Florida gutter company focused on protecting homes from heavy rain and runoff. We install seamless gutters, gutter guards, downspouts, and related drainage solutions so water is directed away from your roofline, foundation, and landscaping. Whether you need a full replacement, an upgrade to reduce clogs, or repairs after storms, our team works with you on a clear plan and straightforward pricing.

We serve homeowners and property managers across the region from 36 SW 8th Ct, Deerfield Beach, FL 33441. That's our base for estimates, scheduling, and coordinating crews across the area. We're open 24/7 for calls and messages—reach out anytime to request a quote, ask about gutter options, or get help with an urgent leak or overflow. During normal project hours we'll line up site visits and installs; after hours, leave a message or use your preferred contact method and we'll get back to you as soon as possible.

Choose All American Gutters when you want dependable workmanship, materials suited to Florida weather, and a local team that stands behind its work. Contact us today to schedule your free estimate and keep your home drier, safer, and better protected year-round.`

/** Google Business Profile share link (footer / address link) */
const GBP_MAPS_APP_URL = 'https://maps.app.goo.gl/chvzb34juJicorxQA'

/**
 * iframe src only — from Google Maps → Share → Embed a map (not the full <iframe> tag).
 * Used by homepage / service-area iframes as `src={mapEmbedUrl}`.
 */
const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d228781.12808711547!2d-80.2606203!3d26.3683978!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d91d7bfe8eb891%3A0x51b7528a70761df5!2sAll%20American!5e0!3m2!1sen!2sus!4v1775072455539!5m2!1sen!2sus'

async function main() {
  if (!projectId || !token) {
    console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in astro-site/.env')
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const keywords = stringListItems([
    'gutters',
    'gutters south florida',
    'gutter installation',
    'gutter repair',
    'gutter guards',
  ])

  const businessCategories = stringListItems(['gutter service', 'gutter cleaning service'])

  const patch = {
    'business.companyName': 'All American Gutters',
    'business.companyNameShort': 'All American Gutters',
    'business.phoneDisplay': '(561) 274-9477',
    'business.phoneTel': '5612749477',
    'business.email': 'info@aaguttersflorida.com',
    'business.websiteUrl': 'https://aaguttersflorida.com/',
    'business.copyrightSiteUrl': 'https://aaguttersflorida.com/',
    'business.addressShort': '36 SW 8th Ct, Deerfield Beach, FL 33441',
    'business.addressMetro': 'Deerfield Beach',
    'business.descriptionShort': DESCRIPTION_SHORT,
    'business.descriptionLong': DESCRIPTION_LONG,
    'business.hoursText': 'Open 24/7',
    'meta.title': 'All American Gutters | Seamless Gutters & Repair | South Florida',
    'meta.description': DESCRIPTION_SHORT,
    keywords,
    businessCategories,
    'businessListings.googleMaps': GBP_MAPS_APP_URL,
    mapEmbedUrl: MAP_EMBED_SRC,
  }

  await client.patch(documentId).set(patch).commit()

  console.log(`Patched ${documentId} with AAGF business, meta, keywords, GBP link, and mapEmbedUrl.`)
  console.log('Publish Site settings in Studio if a draft was created.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
