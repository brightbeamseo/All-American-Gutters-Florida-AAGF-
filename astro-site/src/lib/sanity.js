import { createClient } from '@sanity/client'

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID. Add it to astro-site/.env (see .env.example) and Vercel env.',
  )
}

export const sanity = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  // Must be false: API CDN is eventually consistent and caches reads — offer bar / nav
  // edits in Studio can look "stuck" on old copy (e.g., 10% vs 20%) until cache expires.
  useCdn: false,
})
