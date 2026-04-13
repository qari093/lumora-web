import { describe, expect, it } from "vitest";
import {
  buildRightsGateTelemetryRecord,
  getRightsGateTelemetryKey,
} from "@/src/core/lcex/rightsGateTelemetry";

describe("rightsGateTelemetry", () => {
  it("normalizes telemetry record", () => {
    const record = buildRightsGateTelemetryRecord({
      sourceId: "  src-1 ",
      entityId: "  ent-1 ",
      event: "rights_checked",
      state: "safe-display",
      region: " EU ",
      occurredAt: "2026-03-29T00:00:00.000Z",
    });

    expect(record.sourceId).toBe("src-1");
    expect(record.entityId).toBe("ent-1");
    expect(record.region).toBe("eu");
  });

  it("builds telemetry key", () => {
    const key = getRightsGateTelemetryKey({
      sourceId: "src-1",
      entityId: "ent-1",
      event: "rights_blocked",
      state: "blocked",
      region: "eu",
      occurredAt: "2026-03-29T00:00:00.000Z",
    });

    expect(key).toContain("src-1");
    expect(key).toContain("rights_blocked");
    expect(key).toContain("blocked");
  });
});
