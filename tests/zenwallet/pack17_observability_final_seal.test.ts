import { describe, expect, it } from "vitest";
import { buildZenWalletFinalSeal, collectZenWalletSealInput, REQUIRED_ZENWALLET_LOCKS } from "@/src/core/zenwallet/observability/finalSeal";

describe("ZenWallet Pack 17 — Observability + Final Seal", () => {
  it("defines required locks", () => {
    expect(REQUIRED_ZENWALLET_LOCKS.length).toBe(17);
  });

  it("collects seal input", () => {
    const input = collectZenWalletSealInput();
    expect(input.requiredLocks).toBe(17);
    expect(Array.isArray(input.missingLocks)).toBe(true);
  });

  it("builds final seal report", () => {
    const report = buildZenWalletFinalSeal();
    expect(report.system).toBe("ZenWallet Flawless Global Ω∞");
  });
});
