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
  if (!ENABLED) return

  const payload = {
    ...event,
    ts: Date.now(),
  }

  // Structured JSON log for ingestion (Workers / VM compatible)
  console.log(JSON.stringify({ type: "telemetry", ...payload }))
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
