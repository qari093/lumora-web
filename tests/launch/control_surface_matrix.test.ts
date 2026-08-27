import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("control surface matrix", () => {
  it("all control routes exist", () => {
    const files = [
      "app/control-center/page.tsx",
      "app/dashboard/page.tsx",
      "app/launch/page.tsx",
      "app/status/page.tsx",
      "app/progress/page.tsx",
      "app/system/page.tsx",
    ];

    for (const file of files) {
      expect(fs.existsSync(file)).toBe(true);
    }
  });

  it("control center links every control surface", () => {
    const page = fs.readFileSync("app/control-center/page.tsx", "utf8");

    for (const snippet of [
      "/dashboard",
      "/launch",
      "/status",
      "/progress",
      "/system",
      'data-control-center-key={item.key}',
      "Control Center",
    ]) {
      expect(page.includes(snippet)).toBe(true);
    }
  });

  it("global navigation exposes every control surface", () => {
    const nav = fs.readFileSync("components/navigation/GlobalPortalNav.tsx", "utf8");

    for (const snippet of [
      'href="/control-center"',
      'href: "/dashboard"',
      'href="/launch"',
      'href="/status"',
      'href="/progress"',
      'href="/system"',
      'data-global-nav-system-key="control-center"',
      'data-global-nav-system-key="dashboard"',
      'data-global-nav-system-key="launch"',
      'data-global-nav-system-key="status"',
      'data-global-nav-system-key="progress"',
      'data-global-nav-system-key="system"',
    ]) {
      expect(nav.includes(snippet)).toBe(true);
    }
  });
});
