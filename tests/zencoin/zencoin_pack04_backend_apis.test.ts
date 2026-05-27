import { describe, expect, it } from "vitest";
import {
  walletApis,
  apiHealth
} from "@/core/zencoin/api/backendApis";

describe("Zencoin Pack 04 — Backend APIs", () => {
  it("supports balance api", () => {
    expect(walletApis.balanceApi).toBe(true);
  });

  it("supports spend api", () => {
    expect(walletApis.spendApi).toBe(true);
  });

  it("supports api health", () => {
    expect(apiHealth()).toBe(true);
  });
});
