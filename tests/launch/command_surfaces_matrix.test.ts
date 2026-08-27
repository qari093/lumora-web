import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("command surfaces matrix", () => {
  it("all command surfaces exist", () => {
    const files = [
      "app/control-center/page.tsx",
      "app/operator/page.tsx",
      "app/mission-control/page.tsx",
      "app/dashboard/page.tsx",
      "app/system/page.tsx",
      "app/launch/page.tsx",
      "app/status/page.tsx",
      "app/progress/page.tsx",
    ];

    for (const file of files) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it("global navigation exposes all command surfaces", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");

    for (const snippet of [
      'href="/control-center"',
      'href="/operator"',
      'href="/mission-control"',
      'href: "/dashboard"',
      'href="/system"',
      'href="/launch"',
      'href="/status"',
      'href="/progress"',
      'data-global-nav-system-key="control-center"',
      'data-global-nav-system-key="operator"',
      'data-global-nav-system-key="mission-control"',
      'data-global-nav-system-key="dashboard"',
      'data-global-nav-system-key="system"',
      'data-global-nav-system-key="launch"',
      'data-global-nav-system-key="status"',
      'data-global-nav-system-key="progress"',
    ]) {
      expect(nav.includes(snippet)).toBe(true);
    }
  });

  it("control surfaces contain expected titles", () => {
    const pages = [
      ["app/control-center/page.tsx", "Control Center"],
      ["app/operator/page.tsx", "Operator Console"],
      ["app/mission-control/page.tsx", "Mission Control"],
      ["app/dashboard/page.tsx", "Launch Dashboard"],
      ["app/system/page.tsx", "System Index"],
      ["app/launch/page.tsx", "Launch Snapshot"],
      ["app/status/page.tsx", "System Status"],
      ["app/progress/page.tsx", "Launch Progress"],
    ] as const;

    for (const [file, title] of pages) {
      const text = fs.readFileSync(file, "utf8");
      expect(text.includes(title)).toBe(true);
    }
  });
});
