import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("launch system smoke matrix", () => {
  it("system surfaces are all present", () => {
    const files = [
      "app/launch/page.tsx",
      "app/status/page.tsx",
      "app/progress/page.tsx",
      "app/system/page.tsx",
      "app/api/health/route.ts",
      "app/api/launch/readiness/route.ts",
    ];

    for (const file of files) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it("system index links all launch control surfaces", () => {
    const page = fs.readFileSync("app/system/page.tsx", "utf8");

    for (const snippet of [
      "/launch",
      "/status",
      "/progress",
      "/portals",
      "Launch Snapshot",
      "System Status",
      "Launch Progress",
      "Portal Registry",
      'data-system-index-key={item.key}',
    ]) {
      expect(page.includes(snippet)).toBe(true);
    }
  });

  it("global nav links all system routes", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");

    for (const snippet of [
      'href="/system"',
      'href="/launch"',
      'href="/status"',
      'href="/progress"',
      'data-global-nav-system-key="system"',
      'data-global-nav-system-key="launch"',
      'data-global-nav-system-key="status"',
      'data-global-nav-system-key="progress"',
    ]) {
      expect(nav.includes(snippet)).toBe(true);
    }
  });
});
