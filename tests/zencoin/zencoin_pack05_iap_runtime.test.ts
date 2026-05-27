import { describe, expect, it } from "vitest";
import {
  iapRuntime,
  iapHealthy
} from "@/core/zencoin/iap/iapRuntime";

describe("Zencoin Pack 05 — IAP Runtime", () => {
  it("supports apple iap", () => {
    expect(iapRuntime.appleEnabled).toBe(true);
  });

  it("supports google iap", () => {
    expect(iapRuntime.googleEnabled).toBe(true);
  });

  it("supports healthy iap", () => {
    expect(iapHealthy()).toBe(true);
  });
});
