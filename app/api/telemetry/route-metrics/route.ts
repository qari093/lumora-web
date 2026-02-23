import { getRouteMetrics } from "@/lib/telemetry/metrics"

export const runtime = "nodejs"

export async function GET() {
  // Private Beta gate: require explicit env flag
  const enabled = process.env.LUMORA_TELEMETRY_ENDPOINTS === "1"
  if (!enabled) {
    return new Response(JSON.stringify({ ok: false, error: "disabled" }), {
      status: 404,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }
  return new Response(JSON.stringify({ ok: true, ts: Date.now(), routes: getRouteMetrics() }), {
    status: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
  })
}
