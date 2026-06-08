import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("private beta LAFS safe mode resume", () => {
  it("writes resume artifacts", () => {
    expect(fs.existsSync(".lumora-audits/private-beta-lafs-safe-mode-resume.json")).toBe(true);
    expect(fs.existsSync("data/private-beta/lafs-safe-mode-resume.json")).toBe(true);
    expect(fs.existsSync("docs/runtime/private-beta-lafs-safe-mode-resume.md")).toBe(true);
    expect(fs.existsSync(".lumora_private_beta_lafs_safe_mode_resume_lock")).toBe(true);
  });

  it("resumes beta only with LAFS safe mode sealed", () => {
    const audit = JSON.parse(fs.readFileSync(".lumora-audits/private-beta-lafs-safe-mode-resume.json", "utf8"));

    expect(audit.status).toBe("PASS");
    expect(audit.resume.status).toBe("PRIVATE_BETA_RESUME_WITH_LAFS_SAFE_MODE_READY");
    expect(audit.resume.guards.allowlistOnly).toBe(true);
    expect(audit.resume.guards.publicSignupDisabled).toBe(true);
    expect(audit.resume.guards.paymentLiveMode).toBe(false);
    expect(audit.resume.guards.lafsSafeModeSealed).toBe(true);
    expect(audit.resume.guards.noAutonomousMoneyMovement).toBe(true);
    expect(audit.resume.guards.dashboardReadOnly).toBe(true);
    expect(audit.resume.nextCanonicalPhase).toBe("Private beta wave 1 hold and observe real users");
  });
});
