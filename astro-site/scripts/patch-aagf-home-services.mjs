#!/usr/bin/env node
/**
 * Homepage `#services`: headline + gutter-focused service cards for `homePageSingleton`.
 *
 * Run: cd astro-site && node scripts/patch-aagf-home-services.mjs
 * (Also runs after `npm run content:aagf`.)
 */

import { createClient } from '@sanity/client'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSanityPatchCredentials, loadPatchDotEnv, tryPublishDraft } from './patch-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

loadPatchDotEnv(root)

const { projectId, dataset, token } = getSanityPatchCredentials()

const HEADLINE = 'Gutter services'

/** Canonical paths must match built city/service routes. */
const ITEMS = [
  {
    _type: 'serviceItem',
    _key: 'aagf-gutter-installation',
    number: '01',
    title: 'Gutter installation',
    description:
      'New seamless runs, downspouts, and correct pitch so heavy South Florida rain moves away from your roofline and foundation.',
    href: '/gutter-installation-tampa-fl/',
  },
  {
    _type: 'serviceItem',
    _key: 'aagf-gutter-repair',
    number: '02',
    title: 'Gutter repair',
    description:
      'Fix leaks, sagging, loose hangers, and damaged sections before water stains siding, soffit, or your crawl space.',
    href: '/gutter-repair-tampa-fl/',
  },
  {
    _type: 'serviceItem',
    _key: 'aagf-gutter-replacement',
    number: '03',
    title: 'Gutter replacement',
    description:
      'When rust, storms, or age add up, we replace lengths or the full system with materials sized for your roof and rainfall.',
    href: '/gutter-replacement-tampa-fl/',
  },
  {
    _type: 'serviceItem',
    _key: 'aagf-gutter-cleaning',
    number: '04',
    title: 'Gutter cleaning',
    description:
      'Hand cleaning and flushing to clear debris and buildup so water flows through the season—not over the sides.',
    href: '/gutter-cleaning-tampa-fl/',
  },
  {
    _type: 'serviceItem',
    _key: 'aagf-gutter-guards',
    number: '05',
    title: 'Gutter guards',
    description:
      'Guards and covers that cut leaves and debris while keeping enough open area for Florida downpours.',
    href: '/gutter-guards-tampa-fl/',
  },
  {
    _type: 'serviceItem',
    _key: 'aagf-soffit-fascia',
    number: '06',
    title: 'Soffit & fascia',
    description:
      'Repair or replace soffit and fascia to protect roof edges, look sharp, and support healthy attic ventilation.',
    href: '/soffit-fascia-repair-tampa-fl/',
  },
]

async function main() {
  if (!projectId || !token) {
    console.error(
      'Missing Sanity credentials: set PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID, and SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN (repo-root or astro-site/.env).',
    )
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  await client
    .patch('homePageSingleton')
    .set({
      'services.headline': HEADLINE,
      'services.items': ITEMS,
    })
    .commit()

  console.log(`Patched homePageSingleton → services (${HEADLINE}, ${ITEMS.length} items).`)

  if (await tryPublishDraft(client, 'homePageSingleton')) {
    console.log('Published homePageSingleton (draft → live).')
  } else {
    console.log('No draft for homePageSingleton; public API may already match.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
