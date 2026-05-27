import { describe, expect, it } from "vitest";
import {
  sellerFoundation,
  sellerFoundationHealthy
} from "../../src/core/zendoro/seller/sellerFoundation";

describe("Zendoro Pack 03/08 — Seller Foundation", () => {
  it("supports seller runtime", () => {
    expect(sellerFoundation.kyc).toBe(true);
    expect(sellerFoundationHealthy()).toBe(true);
  });
});
