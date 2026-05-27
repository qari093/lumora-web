import { describe, expect, it } from "vitest";
import { opsCenterHealthy, resolveIncidentSeverity } from "../../../src/core/gmar/ops-center/runtime";

describe("GMAR Pack 39/40 — Operational LiveOps Center", () => {
  it("validates ops center", () => {
    const ops = opsCenterHealthy();

    expect(ops.incidentDashboardReady).toBe(true);
    expect(ops.liveEventControlsReady).toBe(true);
    expect(ops.safetyEscalationReady).toBe(true);
  });

  it("resolves incident severity", () => {
    expect(resolveIncidentSeverity({ affectedUsers: 10, safetyRisk: false })).toBe("low");
    expect(resolveIncidentSeverity({ affectedUsers: 200, safetyRisk: false })).toBe("medium");
    expect(resolveIncidentSeverity({ affectedUsers: 10, safetyRisk: true })).toBe("critical");
  });
});
