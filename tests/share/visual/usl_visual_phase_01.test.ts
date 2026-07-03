import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
  createShareVisualCheck,
  createShareVisualContract,
  summarizeShareVisualReadiness,
} from "@/src/core/share";

function read(path: string) {
  return fs.existsSync(path) ? fs.readFileSync(path, "utf8") : "";
}

describe("USL Visual Route Integration — Phase 01/06 Visual Experience Validation", () => {
  it("locks the canonical visual contract for /share", () => {
    const contract = createShareVisualContract();

    expect(contract.route).toBe("/share");
    expect(contract.requiredSurfaces).toContain("usl-share-demo-page");
    expect(contract.requiredSurfaces).toContain("usl-share-sheet");
    expect(contract.requiredStates).toContain("success");
    expect(contract.requiredDeviceClasses).toContain("mobile");
    expect(contract.requiredAccessibility).toContain("focus_safe");
  });

  it("verifies /share route and client are present", () => {
    expect(fs.existsSync("app/share/page.tsx")).toBe(true);
    expect(fs.existsSync("app/share/ShareDemoClient.tsx")).toBe(true);

    const page = read("app/share/page.tsx");
    const client = read("app/share/ShareDemoClient.tsx");

    expect(page).toContain("ShareDemoClient");
    expect(client).toContain('data-testid="usl-share-demo-page"');
    expect(client).toContain('data-testid="usl-demo-card"');
  });

  it("verifies share sheet visual and interaction surfaces", () => {
    const sheet = read("src/components/share/UniversalShareSheet.tsx");
    const button = read("src/components/share/UniversalShareButton.tsx");
    const fab = read("src/components/share/UniversalShareFab.tsx");

    expect(sheet).toContain("usl-share-sheet");
    expect(sheet).toContain("usl-create-share");
    expect(sheet).toContain("search");
    expect(sheet).toContain("copy");
    expect(button).toContain("usl-share-button");
    expect(fab).toContain("usl-share-fab");
  });

  it("verifies mobile-first styling and accessible button semantics", () => {
    const css = read("src/components/share/universal-share-sheet.css");
    const sheet = read("src/components/share/UniversalShareSheet.tsx");

    expect(css).toMatch(/100svh|100vh|min-height/i);
    expect(css).toMatch(/border-radius|backdrop-filter|overflow/i);
    expect(sheet).toContain('type="button"');
    expect(sheet).toMatch(/aria-label|data-testid/);
  });

  it("summarizes visual readiness", () => {
    const checks = [
      createShareVisualCheck("route", "/share route exists", fs.existsSync("app/share/page.tsx"), "Route file exists."),
      createShareVisualCheck("client", "Share client exists", fs.existsSync("app/share/ShareDemoClient.tsx"), "Client file exists."),
      createShareVisualCheck("sheet", "Share sheet exists", fs.existsSync("src/components/share/UniversalShareSheet.tsx"), "Sheet exists."),
      createShareVisualCheck("button", "Share button exists", fs.existsSync("src/components/share/UniversalShareButton.tsx"), "Button exists."),
      createShareVisualCheck("fab", "Share FAB exists", fs.existsSync("src/components/share/UniversalShareFab.tsx"), "FAB exists."),
    ];

    const summary = summarizeShareVisualReadiness(checks);

    expect(summary.ready).toBe(true);
    expect(summary.passed).toBe(5);
    expect(summary.score).toBe(1);
  });
});
