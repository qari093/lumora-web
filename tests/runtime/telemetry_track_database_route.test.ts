import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("telemetry track database route", () => {
  const source = readFileSync("app/api/telemetry/track/route.ts", "utf8");

  it("persists telemetry through the database layer", () => {
    expect(source).toContain("persistObservabilityEvent");
    expect(source).toContain('source: "api.telemetry.track"');
    expect(source).toContain('source: "database"');
    expect(source).toContain("eventIds");
  });

  it("retains bounded burst and anonymous tester identity", () => {
    expect(source).toContain("slice(0, 50)");
    expect(source).toContain("lumora_tester_id");
    expect(source).toContain("sha256");
  });

  it("removes ephemeral filesystem persistence", () => {
    expect(source).not.toContain("appendFileSync");
    expect(source).not.toContain("mkdirSync");
    expect(source).not.toContain("telemetry.ndjson");
    expect(source).not.toContain(".lumora_telemetry");
  });
});
