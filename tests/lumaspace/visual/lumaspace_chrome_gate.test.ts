import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("LumaSpace source ghost kill", () => {
  it("routes global chrome through LumoraChromeGate", () => {
    const layout = fs.readFileSync("app/layout.tsx", "utf8");
    expect(layout).toContain("LumoraChromeGate");
    expect(layout).not.toContain("<GlobalPortalNav />");
    expect(layout).not.toContain("<HomeBeacon />");
  });

  it("hides chrome on LumaSpace route", () => {
    const gate = fs.readFileSync("components/layout/LumoraChromeGate.tsx", "utf8");
    expect(gate).toContain('pathname?.startsWith("/lumaspace")');
    expect(gate).toContain("return null");
  });
});
