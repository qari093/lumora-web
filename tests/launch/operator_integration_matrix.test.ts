import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("operator integration matrix", () => {
  it("operator integrates readiness + overview sources", () => {
    const page = fs.readFileSync("app/operator/page.tsx", "utf8");

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

  it("operator renders verification layer fields", () => {
    const page = fs.readFileSync("app/operator/page.tsx", "utf8");

    for (const snippet of [
      "Portal Verification",
      "Route Ready:",
      "API Ready:",
      "UI Ready:",
    ]) {
      expect(page.includes(snippet)).toBe(true);
    }
  });

  it("operator connected to all control surfaces", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");

    for (const snippet of [
      'href="/operator"',
      'href="/control-center"',
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
