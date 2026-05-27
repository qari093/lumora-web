import { describe, expect, it } from "vitest";
import {
  registerSeller,
  disableSeller,
  getSeller,
} from "@/src/lib/zendoro/seller/sellerRuntime";

describe("Zendoro Pack 8/12 — Seller Operations", () => {
  it("registers sellers", () => {
    const seller = registerSeller("seller_1", "Zendoro Labs");

    expect(seller.active).toBe(true);
  });

  it("disables sellers", () => {
    registerSeller("seller_2", "Temp");

    const seller = disableSeller("seller_2");

    expect(seller.active).toBe(false);
  });

  it("supports seller lookup", () => {
    registerSeller("seller_3", "Lookup");

    expect(getSeller("seller_3")?.name).toBe("Lookup");
  });
});
