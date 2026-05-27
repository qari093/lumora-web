import { describe, expect, it } from "vitest";
import { createWaitlistEntry } from "../../src/core/ops/traffic/waitlist";
import { evaluateTrafficHealth } from "../../src/core/ops/traffic/metrics";
import { shouldThrottleTraffic } from "../../src/core/ops/traffic/throttles";

describe("real traffic activation", () => {
  it("creates waitlist entries", () => {
    expect(createWaitlistEntry({ email: "fan@test.local" }).status).toBe("queued");
  });

  it("evaluates traffic health", () => {
    expect(evaluateTrafficHealth({
      apiLatencyMs: 120,
      dbLoadPercent: 20,
      queueDepth: 10,
      cdnUsageGb: 1,
    }).healthy).toBe(true);
  });

  it("triggers throttles under pressure", () => {
    expect(shouldThrottleTraffic({ apiLatencyMs: 900, dbLoadPercent: 40 })).toBe(true);
  });
});
