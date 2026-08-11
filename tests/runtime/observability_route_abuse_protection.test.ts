import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const errorRoute = readFileSync("app/api/errors/report/route.ts", "utf8");
const eventRoute = readFileSync("app/api/telemetry/event/route.ts", "utf8");
const trackRoute = readFileSync("app/api/telemetry/track/route.ts", "utf8");

describe("observability route abuse protection", () => {
  it("protects all public observability ingestion routes", () => {
    expect(errorRoute).toContain('scope: "api.errors.report"');
    expect(errorRoute).toContain("limit: 30");
    expect(errorRoute).toContain("maxBodyBytes: 32_768");

    expect(eventRoute).toContain('scope: "api.telemetry.event"');
    expect(eventRoute).toContain("limit: 120");
    expect(eventRoute).toContain("maxBodyBytes: 32_768");

    expect(trackRoute).toContain('scope: "api.telemetry.track"');
    expect(trackRoute).toContain("limit: 60");
    expect(trackRoute).toContain("maxBodyBytes: 65_536");

    for (const source of [errorRoute, eventRoute, trackRoute]) {
      expect(source).toContain("enforceObservabilityRateLimit");
      expect(source).toContain("observabilityRateLimitHeaders");
      expect(source).toContain("error: rateLimit.reason");
      expect(source).toContain("status: rateLimit.status");
      expect(source).toContain("headers: rateHeaders");
    }
  });
});
