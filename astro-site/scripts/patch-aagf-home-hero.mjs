#!/usr/bin/env node
/**
 * Fixes Home page hero copy (still on Tampa / SunLife template) and the call CTA placeholder typo.
 * Patches `homePageSingleton` and `siteSettingsSingleton` → header.callCtaTemplate (nav phone button).
 *
 * Run: cd astro-site && npm run content:aagf:home
 * (Also runs automatically after `npm run content:aagf`.)
 */

import { createClient } from '@sanity/client'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSanityPatchCredentials, loadPatchDotEnv, tryPublishDraft } from './patch-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

loadPatchDotEnv(root)

const { projectId, dataset, token } = getSanityPatchCredentials()

/** Must match applyTemplate() keys in astro-site (see sanity-strings.js). */
const CALL_CTA_TEMPLATE = 'Call: {{phoneDisplay}}'

const HERO = {
  eyebrow: 'Schedule your free estimate',
  headline: 'Best Gutter Company in South Florida',
  lead: 'We install and repair seamless gutters, gutter guards, and downspouts for homes across South Florida. Free estimates, local crews, and reliable workmanship—open 24/7 for your call.',
  callCtaTemplate: CALL_CTA_TEMPLATE,
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

  const homePatch = {
    'hero.eyebrow': HERO.eyebrow,
    'hero.headline': HERO.headline,
    'hero.lead': HERO.lead,
    'hero.callCtaTemplate': HERO.callCtaTemplate,
  }

  await client.patch('homePageSingleton').set(homePatch).commit()
  console.log('Patched homePageSingleton → hero (headline, lead, callCtaTemplate).')

  await client.patch('siteSettingsSingleton').set({ 'header.callCtaTemplate': CALL_CTA_TEMPLATE }).commit()
  console.log('Patched siteSettingsSingleton → header.callCtaTemplate (nav call button).')

  for (const id of ['homePageSingleton', 'siteSettingsSingleton']) {
    if (await tryPublishDraft(client, id)) {
      console.log(`Published ${id} (draft → live).`)
    } else {
      console.log(`No draft for ${id}; public API already had this revision or patch applied in place.`)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
