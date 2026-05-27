import { describe, expect, it } from "vitest";
import { canExportComplianceData, createSupportCase, getSupportedLanguages } from "@/src/core/zenwallet/support/supportCompliance";

describe("ZenWallet Pack 16 — Support + Compliance", () => {
  it("creates support cases", () => {
    expect(createSupportCase("refund", "user_1").status).toBe("open");
  });

  it("supports multilingual expansion", () => {
    expect(getSupportedLanguages(2)).toContain("de");
  });

  it("allows compliance exports", () => {
    expect(canExportComplianceData("gdpr")).toBe(true);
    expect(canExportComplianceData("unknown")).toBe(false);
  });
});
