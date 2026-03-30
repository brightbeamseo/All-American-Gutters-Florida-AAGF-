#!/usr/bin/env node
/**
 * Fetches reviews for the SunLife Gutters Tampa Maps listing using Google Places API (New).
 *
 * Limits (Google):
 * - Place Details returns at most 5 reviews per request, sorted by relevance — not a full dump
 *   of every review on the listing. For ALL reviews with pagination, use Google Business Profile
 *   API as the verified owner: https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list
 *
 * Setup:
 *  1. Google Cloud Console → enable "Places API (New)".
 *  2. Create an API key restricted to Places API.
 *  3. export GOOGLE_PLACES_API_KEY="your-key"
 *  4. From repo root: node scripts/fetch-google-maps-reviews.mjs
 *
 * Optional: GOOGLE_PLACES_TEXT_QUERY override (default targets Seffner address).
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'Reviews (SGT)')
const OUT_JSON = join(OUT_DIR, 'reviews-from-google-places.json')
const OUT_MD = join(OUT_DIR, 'reviews-from-google-places.md')

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || ''
const TEXT_QUERY =
  process.env.GOOGLE_PLACES_TEXT_QUERY ||
  'SunLife Gutters 1502 Lenna Ave Seffner FL 33584'

const PLACES_BASE = 'https://places.googleapis.com/v1'

async function searchPlaceId() {
  const url = `${PLACES_BASE}/places:searchText`
  const body = {
    textQuery: TEXT_QUERY,
    locationBias: {
      circle: {
        center: { latitude: 27.9829373, longitude: -82.2753381 },
        radius: 8000,
      },
    },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.googleMapsUri',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      `searchText failed ${res.status}: ${JSON.stringify(data)}`,
    )
  }
  const places = data.places
  if (!Array.isArray(places) || places.length === 0) {
    throw new Error('No places returned — try a different GOOGLE_PLACES_TEXT_QUERY')
  }
  return places[0].id
}

async function fetchPlaceReviews(placeId) {
  const url = `${PLACES_BASE}/places/${encodeURIComponent(placeId)}`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask':
        'id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri',
    },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`Place details failed ${res.status}: ${JSON.stringify(data)}`)
  }
  return data
}

function toMarkdown(place, fetchedAt) {
  const lines = [
    '# Reviews from Google Places API (New)',
    '',
    `**Fetched:** ${fetchedAt}`,
    `**Place:** ${place.displayName?.text || place.id}`,
    `**Address:** ${place.formattedAddress || '—'}`,
    `**Maps rating:** ${place.rating ?? '—'} (${place.userRatingCount ?? '—'} ratings)`,
    '',
    '> **Note:** Google returns **at most 5 reviews** per Place Details call (no pagination). This is not the full Maps listing. For all reviews, use [Business Profile API](https://developers.google.com/my-business/reference/rest/v4/accounts.locations.reviews/list) as the listing owner.',
    '',
  ]
  const reviews = Array.isArray(place.reviews) ? place.reviews : []
  reviews.forEach((r, i) => {
    const name = r.authorAttribution?.displayName || 'Unknown'
    const when = r.relativePublishTimeDescription || r.publishTime || '—'
    const stars = r.rating ?? '—'
    const text = r.text?.text || r.originalText?.text || ''
    const photo = r.authorAttribution?.photoUri || ''
    lines.push(`## ${i + 1}. ${name}`)
    lines.push('')
    lines.push(`- **Stars:** ${stars}`)
    lines.push(`- **Relative date:** ${when}`)
    if (photo) lines.push(`- **Reviewer photo URL:** ${photo}`)
    lines.push(`- **Text:** ${text.replace(/\n+/g, ' ').trim()}`)
    lines.push('')
  })
  if (reviews.length === 0) {
    lines.push('*(No reviews in API response.)*')
  }
  lines.push('')
  lines.push(`**Google Maps:** ${place.googleMapsUri || '—'}`)
  return lines.join('\n')
}

async function main() {
  if (!API_KEY) {
    console.error(
      'Missing GOOGLE_PLACES_API_KEY. Enable Places API (New) and export your key.',
    )
    process.exit(1)
  }

  mkdirSync(OUT_DIR, { recursive: true })

  const placeId = await searchPlaceId()
  console.log('Resolved place id:', placeId)

  const place = await fetchPlaceReviews(placeId)
  const fetchedAt = new Date().toISOString()

  const payload = {
    fetchedAt,
    textQuery: TEXT_QUERY,
    placeId: place.id,
    displayName: place.displayName?.text,
    formattedAddress: place.formattedAddress,
    rating: place.rating,
    userRatingCount: place.userRatingCount,
    googleMapsUri: place.googleMapsUri,
    reviews: (place.reviews || []).map((r) => ({
      rating: r.rating,
      relativePublishTimeDescription: r.relativePublishTimeDescription,
      publishTime: r.publishTime,
      text: r.text?.text || r.originalText?.text || '',
      authorDisplayName: r.authorAttribution?.displayName,
      authorPhotoUri: r.authorAttribution?.photoUri,
      authorUri: r.authorAttribution?.uri,
      googleMapsUri: r.googleMapsUri,
    })),
    _note:
      'Places API returns max 5 reviews. For full list use Google Business Profile API (owner).',
  }

  writeFileSync(OUT_JSON, JSON.stringify(payload, null, 2), 'utf8')
  writeFileSync(OUT_MD, toMarkdown(place, fetchedAt), 'utf8')

  console.log('Wrote:', OUT_JSON)
  console.log('Wrote:', OUT_MD)
  console.log('Review count:', payload.reviews.length)
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
