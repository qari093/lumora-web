import { describe, it, expect } from "vitest"
import { record } from "@/lib/telemetry/telemetry"

describe("telemetry layer", () => {
  it("does not throw when disabled", () => {
    expect(() => record({ route: "/health" })).not.toThrow()
  })
})
