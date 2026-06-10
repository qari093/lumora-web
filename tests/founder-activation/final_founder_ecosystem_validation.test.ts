import { describe, expect, it } from "vitest";
import fs from "node:fs";

describe("Final founder ecosystem validation", () => {
  it("writes final validation artifacts", () => {
    expect(fs.existsSync("data/founder-activation/final-founder-ecosystem-validation.json")).toBe(true);
    expect(fs.existsSync(".lumora-audits/final-founder-ecosystem-validation.json")).toBe(true);
  });

  it("confirms all founder packs passed", () => {
    const report = JSON.parse(
      fs.readFileSync(
        "data/founder-activation/final-founder-ecosystem-validation.json",
        "utf8"
      )
    );

    expect(report.status).toBe("PASS");
    expect(report.founderActivationPacksCompleted).toBe(6);
    expect(report.founderActivationPacksTotal).toBe(6);
    expect(report.testerInvitesAllowed).toBe(false);
    expect(report.paymentLiveModeAllowed).toBe(false);
  });
});
