import { describe, expect, it } from "vitest";
import {
  buildFallbackTelemetryRecord,
  getFallbackTelemetryKey,
} from "@/src/core/lcex/fallbackTelemetry";

describe("fallbackTelemetry", () => {
  it("normalizes telemetry record fields", () => {
    const record = buildFallbackTelemetryRecord({
      fallbackId: "  abc  ",
      fallbackKind: "metadata-only",
      event: "fallback_rendered",
      sessionId: "  sess-1 ",
      occurredAt: "2026-03-29T00:00:00.000Z",
      region: " EU ",
      language: " EN ",
    });

    expect(record.fallbackId).toBe("abc");
    expect(record.sessionId).toBe("sess-1");
    expect(record.region).toBe("eu");
    expect(record.language).toBe("en");
  });

  it("builds stable telemetry keys", () => {
    const key = getFallbackTelemetryKey({
      fallbackId: "abc",
      fallbackKind: "poster-only",
      event: "fallback_clicked",
      sessionId: "sess-1",
      occurredAt: "2026-03-29T00:00:00.000Z",
    });

    expect(key).toContain("abc");
    expect(key).toContain("poster-only");
    expect(key).toContain("fallback_clicked");
  });
});
