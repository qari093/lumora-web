import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch meta smoke suite", () => {
  it("launch snapshot page is wired", () => {
    const page = fs.readFileSync("app/launch/page.tsx", "utf8");
    expect(page.includes("getLaunchReadiness")).toBe(true);
    expect(page.includes("getPortalOverview")).toBe(true);
    expect(page.includes("Launch Snapshot")).toBe(true);
    expect(page.includes("data-launch-status")).toBe(true);
    expect(page.includes("data-launch-portal-key")).toBe(true);
  });

  it("home hub includes readiness and overview panels", () => {
    const home = fs.readFileSync("components/home/HomePortalHub.tsx", "utf8");
    expect(home.includes('fetch("/api/launch/readiness"')).toBe(true);
    expect(home.includes('fetch("/api/portal-overview"')).toBe(true);
    expect(home.includes('data-home-readiness="ready"')).toBe(true);
    expect(home.includes('data-home-overview="ready"')).toBe(true);
  });

  it("launch readiness and overview apis exist", () => {
    const readinessApi = fs.readFileSync("app/api/launch/readiness/route.ts", "utf8");
    const overviewApi = fs.readFileSync("app/api/portal-overview/route.ts", "utf8");

    expect(readinessApi.includes("lumora_launch_readiness_v1")).toBe(true);
    expect(overviewApi.includes("getPortalOverview")).toBe(true);
  });
});
