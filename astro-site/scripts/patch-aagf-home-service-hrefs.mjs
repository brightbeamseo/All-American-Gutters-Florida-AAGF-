#!/usr/bin/env node
/**
 * Writes canonical service page URLs into `homePageSingleton.services.items[].href`.
 * Run after removing legacy href normalization from Astro — links must live in Sanity.
 *
 * Run: cd astro-site && node scripts/patch-aagf-home-service-hrefs.mjs
 * (Also runs at end of `npm run content:aagf`.)
 */

import { createClient } from '@sanity/client'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSanityPatchCredentials, loadPatchDotEnv, tryPublishDraft } from './patch-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

loadPatchDotEnv(root)

const { projectId, dataset, token } = getSanityPatchCredentials()

/** Lowercased title → live site path (trailing slash). */
const HREF_BY_TITLE = {
  'seamless gutters': '/seamless-gutters-tampa-fl/',
  'soffit and fascia': '/soffit-fascia-repair-tampa-fl/',
  'soffit & fascia': '/soffit-fascia-repair-tampa-fl/',
  'screen rooms': '/screen-rooms-lanais-tampa-fl/',
  'screen rooms & lanais': '/screen-rooms-lanais-tampa-fl/',
  'underground drainage': '/underground-drainage-tampa-fl/',
  'super gutters': '/super-gutters-tampa-fl/',
  siding: '/siding-tampa-fl/',
}

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

  const doc = await client.fetch(
    `*[_id == "homePageSingleton"][0]{ "items": services.items[]{ _key, title } }`,
  )
  const items = Array.isArray(doc?.items) ? doc.items : []
  if (items.length === 0) {
    console.log('No homePageSingleton.services.items; nothing to patch.')
    return
  }

  let patch = client.patch('homePageSingleton')
  let n = 0
  for (const row of items) {
    const key = row?._key
    const title = String(row?.title ?? '').toLowerCase().trim()
    if (!key || !title) continue
    const href = HREF_BY_TITLE[title]
    if (!href) {
      console.warn(`No canonical href mapping for service title "${row?.title}" (_key ${key}); skip.`)
      continue
    }
    patch = patch.set({ [`services.items[_key=="${key}"].href`]: href })
    n++
  }

  if (n === 0) {
    console.log('No service href fields updated.')
    return
  }

  await patch.commit()
  console.log(`Patched homePageSingleton → ${n} service card href(s).`)

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
