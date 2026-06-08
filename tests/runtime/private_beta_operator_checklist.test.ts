import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta operator checklist", () => {
  it("writes operator checklist artifacts", () => {
    expect(fs.existsSync("data/private-beta/operator-checklist.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/private-beta-operator-checklist.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-operator-checklist.md")).toBe(true);
  });

  it("keeps operator launch controls conservative", () => {
    const checklist = JSON.parse(fs.readFileSync("data/private-beta/operator-checklist.json", "utf8"));
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-operator-checklist.json", "utf8"));

    expect(checklist.status).toBe("PRIVATE_BETA_OPERATOR_CHECKLIST_READY");
    expect(Object.values(checklist.checklist).every(Boolean)).toBe(true);
    expect(checklist.guards.maxWaveOneInvites).toBeLessThanOrEqual(25);
    expect(checklist.guards.manualExpansionOnly).toBe(true);
    expect(checklist.guards.pauseOnCriticalIssue).toBe(true);
    expect(checklist.guards.pauseOnUnauthorizedAccess).toBe(true);
    expect(audit.nextCanonicalPhase).toBe("Private beta first invite dispatch seal");
  });
});
