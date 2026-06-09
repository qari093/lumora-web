import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Ecosystem Pack 08/08", () => {
  it("final approval seal exists", () => {
    expect(
      fs.existsSync(
        "data/ecosystem/pack08-final-ecosystem-approval-seal.json"
      )
    ).toBe(true);
  });

  it("ecosystem remains blocked until explicit approval", () => {
    const data = JSON.parse(
      fs.readFileSync(
        "data/ecosystem/pack08-final-ecosystem-approval-seal.json",
        "utf8"
      )
    );

    expect(data.status).toBe("PASS");
    expect(data.approvalState.ecosystemReviewReady).toBe(true);
    expect(data.finalGate.waqarApprovalRequired).toBe(true);
    expect(data.finalGate.ecosystemApproved).toBe(false);
    expect(data.finalGate.betaInvitesAllowed).toBe(false);
  });
});
