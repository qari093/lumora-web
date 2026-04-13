import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("dashboard integration matrix", () => {
  it("dashboard integrates readiness + overview sources", () => {
    const page = fs.readFileSync("app/dashboard/page.tsx", "utf8");

    for (const snippet of [
      'getLaunchReadiness',
      'getPortalOverview',
      'readiness.status',
      'readiness.score',
      'overview.active',
      'overview.healthy',
      'overview.items.map',
    ]) {
      expect(page.includes(snippet)).toBe(true);
    }
  });

  it("dashboard renders system-level observability fields", () => {
    const page = fs.readFileSync("app/dashboard/page.tsx", "utf8");

    for (const snippet of [
      "Readiness",
      "Score",
      "Active Portals",
      "Healthy Portals",
      "Portal Matrix",
      "Healthy:",
    ]) {
      expect(page.includes(snippet)).toBe(true);
    }
  });

  it("dashboard connected to launch + system surfaces", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");

    for (const snippet of [
      'href="/dashboard"',
      'href="/system"',
      'href="/launch"',
      'href="/status"',
      'href="/progress"',
    ]) {
      expect(nav.includes(snippet)).toBe(true);
    }
  });
});
