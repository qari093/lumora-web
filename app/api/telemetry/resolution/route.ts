import { getResolutionDistribution } from "@/lib/telemetry/resolution"

export const runtime = "nodejs"

export async function GET() {
  const enabled = process.env.LUMORA_TELEMETRY_ENDPOINTS === "1"
  if (!enabled) {
    return new Response(JSON.stringify({ ok: false, error: "disabled" }), {
      status: 404,
      headers: { "content-type": "application/json; charset=utf-8" },
    })
  }

  return new Response(
    JSON.stringify({
      ok: true,
      ts: Date.now(),
      distribution: getResolutionDistribution(),
    }),
    {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    }
  )
}
