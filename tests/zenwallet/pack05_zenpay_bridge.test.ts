import { describe, expect, it } from "vitest";
import { resolvePreferredPSP } from "@/src/core/zenwallet/zenpay/bridge";

describe("ZenWallet Pack 05", () => {
  it("routes PSP by region", () => {
    expect(resolvePreferredPSP("IN")).toBe("razorpay");
    expect(resolvePreferredPSP("NG")).toBe("paystack");
  });
});
