#!/usr/bin/env node
/**
 * Fixes Home page hero copy (still on Tampa / SunLife template) and the call CTA placeholder typo.
 * Patches `homePageSingleton` and `siteSettingsSingleton` → header.callCtaTemplate (nav phone button).
 *
 * Run: cd astro-site && npm run content:aagf:home
 * (Also runs automatically after `npm run content:aagf`.)
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

/** Must match applyTemplate() keys in astro-site (see sanity-strings.js). */
const CALL_CTA_TEMPLATE = 'Call: {{phoneDisplay}}'

const HERO = {
  eyebrow: 'Schedule your free estimate',
  headline: 'South Florida Gutter Installation & Repair',
  lead: 'We install and repair seamless gutters, gutter guards, and downspouts for homes across South Florida. Free estimates, local crews, and reliable workmanship—open 24/7 for your call.',
  callCtaTemplate: CALL_CTA_TEMPLATE,
}

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

  console.log('Publish Home page + Site settings in Studio if drafts were created.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
