import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("portal data contract suite", () => {
  it("portal cards source exposes canonical fields", () => {
    const text = fs.readFileSync("lib/portal/getPortalCards.ts", "utf8");
    for (const snippet of [
      "key:",
      "path:",
      "enabled:",
      "title:",
      "subtitle:",
      "status:",
    ]) {
      expect(text.includes(snippet)).toBe(true);
    }
  });

  it("portal overview source exposes health fields", () => {
    const text = fs.readFileSync("lib/portal/getPortalOverview.ts", "utf8");
    for (const snippet of [
      "routeReady",
      "apiReady",
      "uiReady",
      "healthy",
      "total:",
      "active:",
      "healthy:",
      "items:",
    ]) {
      expect(text.includes(snippet)).toBe(true);
    }
  });

  it("launch readiness source exposes score and checks", () => {
    const text = fs.readFileSync("lib/launch/getLaunchReadiness.ts", "utf8");
    for (const snippet of [
      'status:',
      'passed',
      'total',
      'score:',
      'checks',
      '"fyp_ready"',
      '"profile_ready"',
    ]) {
      expect(text.includes(snippet)).toBe(true);
    }
  });
});
