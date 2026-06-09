import { describe, it, expect } from "vitest";
import fs from "fs";

describe("Ecosystem Pack 05/08", () => {
  it("commerce economy validation artifact exists", () => {
    expect(fs.existsSync("data/ecosystem/pack05-commerce-economy-validation.json")).toBe(true);
  });

  it("keeps payment and economy systems in safe mode", () => {
    const data = JSON.parse(fs.readFileSync("data/ecosystem/pack05-commerce-economy-validation.json", "utf8"));

    expect(data.status).toBe("PASS");
    expect(data.commerce.checkoutSafeMode).toBe(true);
    expect(data.commerce.paymentLiveMode).toBe(false);
    expect(data.commerce.stripeLiveMode).toBe(false);
    expect(data.economy.lafsSafeMode).toBe(true);
    expect(data.economy.noAutonomousMoneyMovement).toBe(true);
    expect(data.economy.humanApprovalRequired).toBe(true);
    expect(data.approvalGateRequired).toBe(true);
  });
});
