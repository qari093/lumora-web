import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch surface smoke suite", () => {
  it("status page is wired with readiness + health fields", () => {
    const page = fs.readFileSync("app/status/page.tsx", "utf8");
    expect(page.includes("getLaunchReadiness")).toBe(true);
    expect(page.includes("getPortalOverview")).toBe(true);
    expect(page.includes("data-status-readiness")).toBe(true);
    expect(page.includes("data-status-health")).toBe(true);
    expect(page.includes("data-status-total")).toBe(true);
    expect(page.includes("data-status-active")).toBe(true);
    expect(page.includes("data-status-healthy")).toBe(true);
    expect(page.includes("data-status-score")).toBe(true);
  });

  it("health endpoint is wired with readiness + overview", () => {
    const api = fs.readFileSync("app/api/health/route.ts", "utf8");
    expect(api.includes("getLaunchReadiness")).toBe(true);
    expect(api.includes("getPortalOverview")).toBe(true);
    expect(api.includes("lumora_health_v1")).toBe(true);
    expect(api.includes("portalsHealthy")).toBe(true);
    expect(api.includes("portalsActive")).toBe(true);
  });

  it("launch snapshot page exists alongside status page", () => {
    const launchPage = fs.readFileSync("app/launch/page.tsx", "utf8");
    const statusPage = fs.readFileSync("app/status/page.tsx", "utf8");
    expect(launchPage.includes("Launch Snapshot")).toBe(true);
    expect(statusPage.includes("System Status")).toBe(true);
  });
});
