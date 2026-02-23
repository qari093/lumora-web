import { getRouteMetrics } from "@/lib/telemetry/metrics"

type Snap = {
  ts: number
  routes: ReturnType<typeof getRouteMetrics>
}

function isNode(): boolean {
  return typeof process !== "undefined" && !!(process as any).versions?.node
}

export async function writeRouteMetricsSnapshotIfEnabled() {
  if (!isNode()) return
  const enabled = process.env.LUMORA_TELEMETRY_SNAPSHOT === "1"
  if (!enabled) return

  const path = process.env.LUMORA_TELEMETRY_SNAPSHOT_PATH || "artifacts/telemetry_route_metrics.json"
  const fs = await import("node:fs/promises")

  const snap: Snap = { ts: Date.now(), routes: getRouteMetrics() }
  await fs.mkdir("artifacts", { recursive: true })
  await fs.writeFile(path, JSON.stringify(snap, null, 2) + "\n", "utf8")
}
