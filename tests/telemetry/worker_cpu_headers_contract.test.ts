import { describe, it, expect } from "vitest"
import { withTelemetry } from "@/lib/http/api"

describe("worker cpu logging", () => {
  it("adds x-lumora-cpu-ms + duration headers", async () => {
    const handler = withTelemetry("/api/test", async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    })

    const res = await handler(new Request("http://local/api/test"))
    expect(res.headers.get("x-lumora-route")).toBe("/api/test")
    expect(res.headers.get("x-lumora-duration-ms")).toMatch(/^\d+$/)
    expect(res.headers.get("x-lumora-cpu-ms")).toMatch(/^\d+$/)
  })
})
