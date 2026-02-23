export type RouteMetric = {
  route: string
  count: number
  // ms
  min: number
  max: number
  avg: number
  p50: number
  p95: number
  p99: number
  lastUpdated: number
}

type Bucket = {
  route: string
  n: number
  min: number
  max: number
  sum: number
  // bounded samples for quantiles (kept small + cheap)
  samples: number[]
  lastUpdated: number
}

const MAX_SAMPLES = 512

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))
  return sorted[idx] ?? 0
}

const buckets = new Map<string, Bucket>()

export function resetRouteMetricsForTest() {
  buckets.clear()
}

export function recordRouteDuration(route: string, durationMs: number) {
  const d = Math.max(0, Number.isFinite(durationMs) ? durationMs : 0)
  let b = buckets.get(route)
  if (!b) {
    b = { route, n: 0, min: d, max: d, sum: 0, samples: [], lastUpdated: Date.now() }
    buckets.set(route, b)
  }
  b.n += 1
  b.min = Math.min(b.min, d)
  b.max = Math.max(b.max, d)
  b.sum += d
  b.lastUpdated = Date.now()

  // reservoir-ish: keep last MAX_SAMPLES values (fast, predictable)
  b.samples.push(d)
  if (b.samples.length > MAX_SAMPLES) b.samples.splice(0, b.samples.length - MAX_SAMPLES)
}

export function getRouteMetrics(): RouteMetric[] {
  const out: RouteMetric[] = []
  for (const b of buckets.values()) {
    const s = [...b.samples].sort((a, c) => a - c)
    const avg = b.n > 0 ? b.sum / b.n : 0
    out.push({
      route: b.route,
      count: b.n,
      min: b.min,
      max: b.max,
      avg,
      p50: quantile(s, 0.50),
      p95: quantile(s, 0.95),
      p99: quantile(s, 0.99),
      lastUpdated: b.lastUpdated,
    })
  }
  out.sort((a, b) => a.route.localeCompare(b.route))
  return out
}
