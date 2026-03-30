import {createClient} from '@sanity/client'

const OLD_NAME = 'SunLife Gutters & Homes'
const NEW_NAME = 'SunLife Gutters Tampa'

const client = createClient({
  projectId: '04s0hjml',
  dataset: 'production',
  apiVersion: '2026-03-30',
  useCdn: false,
})

const SYSTEM_KEYS = new Set([
  '_id',
  '_type',
  '_createdAt',
  '_updatedAt',
  '_rev',
])

function deepReplace(value) {
  if (typeof value === 'string') {
    return value.includes(OLD_NAME) ? value.split(OLD_NAME).join(NEW_NAME) : value
  }
  if (Array.isArray(value)) {
    let changed = false
    const next = value.map((item) => {
      const replaced = deepReplace(item)
      if (replaced !== item) changed = true
      return replaced
    })
    return changed ? next : value
  }
  if (value && typeof value === 'object') {
    let changed = false
    const next = {}
    for (const [k, v] of Object.entries(value)) {
      const replaced = deepReplace(v)
      if (replaced !== v) changed = true
      next[k] = replaced
    }
    return changed ? next : value
  }
  return value
}

async function run() {
  const docs = await client.fetch(`*[
    !(_type match "sanity.*") &&
    !(_id in path("versions.**"))
  ]`)

  const changed = []

  for (const doc of docs) {
    const setPayload = {}
    for (const [key, value] of Object.entries(doc)) {
      if (SYSTEM_KEYS.has(key)) continue
      const replaced = deepReplace(value)
      if (replaced !== value) {
        setPayload[key] = replaced
      }
    }

    if (Object.keys(setPayload).length === 0) continue

    await client.patch(doc._id).set(setPayload).commit()
    changed.push({id: doc._id, type: doc._type, fields: Object.keys(setPayload)})
  }

  console.log(JSON.stringify({oldName: OLD_NAME, newName: NEW_NAME, totalDocs: docs.length, changedCount: changed.length, changed}, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
