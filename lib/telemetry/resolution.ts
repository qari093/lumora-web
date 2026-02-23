export type ResolutionBucket = {
  label: string
  count: number
  bytes: number
  lastSeen: number
}

type Bucket = {
  label: string
  count: number
  bytes: number
  lastSeen: number
}

const buckets = new Map<string, Bucket>()

export function resetResolutionForTest() {
  buckets.clear()
}

function normalizeLabel(input: string): string {
  const s = (input || "").toString().trim().toLowerCase()
  if (!s) return "unknown"

  // Accept common formats: "720p", "1080", "1080p", "1920x1080"
  if (/^\d{3,4}p$/.test(s)) return s
  if (/^\d{3,4}$/.test(s)) return `${s}p`
  const m = s.match(/(\d{3,4})\s*x\s*(\d{3,4})/)
  if (m) {
    // Use height as canonical, e.g. 1920x1080 -> 1080p
    const h = Number(m[2])
    if (Number.isFinite(h) && h > 0) return `${h}p`
  }
  return s
}

export function recordResolutionUsage(label: string, bytes: number) {
  const key = normalizeLabel(label)
  const b = buckets.get(key) ?? { label: key, count: 0, bytes: 0, lastSeen: 0 }
  b.count += 1
  b.bytes += Math.max(0, Number.isFinite(bytes) ? bytes : 0)
  b.lastSeen = Date.now()
  buckets.set(key, b)
}

export function getResolutionDistribution(): ResolutionBucket[] {
  return [...buckets.values()]
    .sort((a, b) => b.bytes - a.bytes)
    .map((b) => ({
      label: b.label,
      count: b.count,
      bytes: b.bytes,
      lastSeen: b.lastSeen,
    }))
}
