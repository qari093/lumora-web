import { describe, expect, it } from "vitest";
import { listProducts, getProduct, getOrCreateCart } from "@/src/core/zendoro/api/store";

describe("Zendoro Pack 4/12 — Storefront + Buyer UX", () => {
  it("has marketplace product supply", () => {
    const products = listProducts();
    expect(products.length).toBeGreaterThan(0);
    expect(products[0]?.title).toContain("Zendoro");
  });

  it("supports product detail lookup", () => {
    const product = getProduct("zendoro-demo-product");
    expect(product?.currency).toBe("EUR");
  });

  it("supports buyer cart state for UI", () => {
    const cart = getOrCreateCart("anonymous");
    expect(cart.currency).toBe("EUR");
    expect(Array.isArray(cart.items)).toBe(true);
  });
});
