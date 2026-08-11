import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("observability database routes", () => {
  it("persists enabled error reports through Prisma", () => {
    const source = readFileSync(
      "app/api/errors/report/route.ts",
      "utf8",
    );

    expect(source).toContain("persistErrorReport");
    expect(source).toContain(
      "LUMORA_ERROR_MONITORING_ENABLED",
    );
    expect(source).toContain(
      "error_message_required",
    );
    expect(source).toContain(
      "error_report_persistence_failed",
    );
    expect(source).toContain("reportId");
    expect(source).toContain(
      "no-store, max-age=0",
    );
    expect(source).not.toContain(
      "Persistence to Sentry/OTel/DB is wired later",
    );
  });

  it("persists enabled telemetry events through Prisma", () => {
    const source = readFileSync(
      "app/api/telemetry/event/route.ts",
      "utf8",
    );

    expect(source).toContain(
      "persistObservabilityEvent",
    );
    expect(source).toContain(
      "LUMORA_TELEMETRY_ENABLED",
    );
    expect(source).toContain(
      "telemetry_event_name_required",
    );
    expect(source).toContain(
      "telemetry_event_persistence_failed",
    );
    expect(source).toContain("eventId");
    expect(source).toContain(
      "no-store, max-age=0",
    );
    expect(source).not.toContain(
      "Do not log, do not persist",
    );
  });

  it("keeps disabled production mode non-persistent", () => {
    const errorRoute = readFileSync(
      "app/api/errors/report/route.ts",
      "utf8",
    );
    const telemetryRoute = readFileSync(
      "app/api/telemetry/event/route.ts",
      "utf8",
    );

    expect(errorRoute).toContain(
      "persisted: false",
    );
    expect(telemetryRoute).toContain(
      "persisted: false",
    );
  });
});
