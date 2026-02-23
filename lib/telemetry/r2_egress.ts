export type R2AssetMetric = {
  key: string
  count: number
  bytes: number
  lastAccess: number
}

type Bucket = {
  key: string
  count: number
  bytes: number
  lastAccess: number
}

const buckets = new Map<string, Bucket>()

export function resetR2EgressForTest() {
  buckets.clear()
}

export function recordR2Egress(key: string, bytes: number) {
  if (!key || typeof key !== "string") return
  const b = buckets.get(key) ?? { key, count: 0, bytes: 0, lastAccess: 0 }
  b.count += 1
  b.bytes += Math.max(0, Number.isFinite(bytes) ? bytes : 0)
  b.lastAccess = Date.now()
  buckets.set(key, b)
}

export function getR2EgressMetrics(): R2AssetMetric[] {
  return [...buckets.values()]
    .sort((a, b) => b.bytes - a.bytes)
    .map((b) => ({
      key: b.key,
      count: b.count,
      bytes: b.bytes,
      lastAccess: b.lastAccess,
    }))
}
