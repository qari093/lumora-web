import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta allowlist guard audit", () => {
  it("writes allowlist guard audit artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-allowlist-guard-audit.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-allowlist-guard-audit.md")).toBe(true);
  });

  it("passes only when private beta routes are guarded", () => {
    const report = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-allowlist-guard-audit.json", "utf8"));
    expect(report.status).toBe("PASS");
    expect(report.routes.every((r: any) => r.exists && r.bytes > 0)).toBe(true);
    expect(report.routes.every((r: any) => r.mentionsPrivateBeta && r.mentionsAllowlist)).toBe(true);
    expect(report.routes.every((r: any) => !r.unsafeOpenAccess)).toBe(true);
  });
});
