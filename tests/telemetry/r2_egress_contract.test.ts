import { describe, it, expect, beforeEach } from "vitest"
import { recordR2Egress, getR2EgressMetrics, resetR2EgressForTest } from "@/lib/telemetry/r2_egress"

describe("R2 egress metrics", () => {
  beforeEach(() => resetR2EgressForTest())

  it("aggregates bytes per asset key", () => {
    recordR2Egress("video/a.mp4", 100)
    recordR2Egress("video/a.mp4", 300)
    recordR2Egress("video/b.mp4", 50)

    const all = getR2EgressMetrics()

    expect(all.length).toBe(2)

    const a = all.find((x) => x.key === "video/a.mp4")
    expect(a).toBeTruthy()
    expect(a!.bytes).toBe(400)
    expect(a!.count).toBe(2)

    const b = all.find((x) => x.key === "video/b.mp4")
    expect(b!.bytes).toBe(50)
    expect(b!.count).toBe(1)
  })

  it("sorts by highest egress first", () => {
    recordR2Egress("big", 1000)
    recordR2Egress("small", 10)
    const all = getR2EgressMetrics()
    expect(all[0].key).toBe("big")
  })
})
