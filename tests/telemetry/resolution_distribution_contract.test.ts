import { describe, it, expect, beforeEach } from "vitest"
import {
  recordResolutionUsage,
  getResolutionDistribution,
  resetResolutionForTest,
} from "@/lib/telemetry/resolution"

describe("resolution distribution", () => {
  beforeEach(() => resetResolutionForTest())

  it("normalizes labels and aggregates bytes/count", () => {
    recordResolutionUsage("720", 100)
    recordResolutionUsage("720p", 50)
    recordResolutionUsage("1920x1080", 300)
    recordResolutionUsage("1080P", 200)

    const dist = getResolutionDistribution()

    const r720 = dist.find((d) => d.label === "720p")
    expect(r720).toBeTruthy()
    expect(r720!.count).toBe(2)
    expect(r720!.bytes).toBe(150)

    const r1080 = dist.find((d) => d.label === "1080p")
    expect(r1080).toBeTruthy()
    expect(r1080!.count).toBe(2)
    expect(r1080!.bytes).toBe(500)
  })

  it("sorts by bytes desc", () => {
    recordResolutionUsage("480p", 10)
    recordResolutionUsage("720p", 1000)
    const dist = getResolutionDistribution()
    expect(dist[0].label).toBe("720p")
  })
})
