import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Ecosystem Pack 07/08", () => {
  it("ecosystem readiness artifact exists", () => {
    expect(
      fs.existsSync(
        "data/ecosystem/pack07-ecosystem-readiness-validation.json"
      )
    ).toBe(true);
  });

  it("ecosystem readiness passes", () => {
    const data = JSON.parse(
      fs.readFileSync(
        "data/ecosystem/pack07-ecosystem-readiness-validation.json",
        "utf8"
      )
    );

    expect(data.status).toBe("PASS");
    expect(data.readiness.surfaceValidationComplete).toBe(true);
    expect(data.readiness.runtimeValidationComplete).toBe(true);
    expect(data.readiness.portalValidationComplete).toBe(true);
    expect(data.readiness.navigationValidationComplete).toBe(true);
    expect(data.readiness.commerceValidationComplete).toBe(true);
    expect(data.readiness.uiValidationComplete).toBe(true);
    expect(data.approvalGate.ecosystemApprovalRequired).toBe(true);
    expect(data.approvalGate.testerSelectionBlocked).toBe(true);
    expect(data.approvalGate.inviteIssuanceBlocked).toBe(true);
  });
});
