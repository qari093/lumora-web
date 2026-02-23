import { record } from "@/lib/telemetry/telemetry"
import { measureCpu } from "@/lib/telemetry/cpu"

export type ApiHandler = (req: Request) => Promise<Response>

export function withTelemetry(route: string, handler: ApiHandler): ApiHandler {
  return async (req: Request) => {
    try {
      const { result, sample } = await measureCpu(() => handler(req))
      // annotate response with CPU sample for live verification
      const res = result
      const headers = new Headers(res.headers)
      headers.set("x-lumora-route", route)
      headers.set("x-lumora-duration-ms", String(Math.round(sample.durationMs)))
      headers.set("x-lumora-cpu-ms", String(Math.round(sample.cpuMs)))

      record({
        route,
        durationMs: sample.durationMs,
        cpuMs: sample.cpuMs,
        status: res.status,
      })

      return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
    } catch (e: any) {
      const msg = typeof e?.message === "string" ? e.message : "internal_error"
      record({ route, status: 500, meta: { error: msg } })
      return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
        status: 500,
        headers: { "content-type": "application/json; charset=utf-8", "x-lumora-route": route },
      })
    }
  }
}
