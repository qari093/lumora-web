import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("duplicate route compatibility audit artifacts", () => {
  it("writes runtime duplicate audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/duplicate-route-compatibility-audit.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/duplicate-route-risk-list.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/duplicate-route-compatibility-audit.md")).toBe(true);
  });

  it("contains required route groups", () => {
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/duplicate-route-compatibility-audit.json", "utf8"));
    expect(audit.groups.liveRoomAliases).toBeTruthy();
    expect(audit.groups.fypLegacy).toBeTruthy();
    expect(audit.groups.walletZencoinOverlap).toBeTruthy();
    expect(audit.groups.zendoroCommerceOverlap).toBeTruthy();
  });
});
