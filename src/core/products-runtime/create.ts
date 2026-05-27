import type { ProductRuntime } from "./types";

export function createProductRuntime(input: ProductRuntime) {
  if (input.priceCents < 0) {
    throw new Error("INVALID_PRODUCT_PRICE");
  }

  return {
    ...input,
    createdAt: new Date().toISOString(),
  };
}
