import { writeRouteMetricsSnapshotIfEnabled } from "@/lib/telemetry/snapshot";
import { recordRouteDuration } from "@/lib/telemetry/metrics";
export type TelemetryEvent = {
  route?: string
  durationMs?: number
  cpuMs?: number
  status?: number
  meta?: Record<string, any>
  ts?: number
}

const ENABLED =
  process.env.NODE_ENV === "production" ||
  process.env.LUMORA_TELEMETRY === "1"

export function record(event: TelemetryEvent) {
  try {
    const r = (event as any)?.route;
    const d = (event as any)?.durationMs;
    if (typeof r === "string" && typeof d === "number" && Number.isFinite(d)) {
      recordRouteDuration(r, d);
    }
  } catch { /* ignore */ }
if (!ENABLED) return

  const payload = {
    ...event,
    ts: Date.now(),
  }

  // Structured JSON log for ingestion (Workers / VM compatible)
  console.log(JSON.stringify({ type: "telemetry", ...payload }))
  try {
    void writeRouteMetricsSnapshotIfEnabled();
  } catch { /* ignore */ }

}

export function timed<T>(
  route: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  return fn()
    .then((res) => {
      const duration = performance.now() - start
      record({ route, durationMs: duration })
      return res
    })
    .catch((err) => {
      const duration = performance.now() - start
      record({ route, durationMs: duration, status: 500 })
      throw err
    })
}
