import { describe, expect, it } from "vitest";
import {
  ensureInventory,
  reserveInventory,
  releaseInventory,
} from "@/src/lib/zendoro/inventory/inventoryRuntime";

describe("Zendoro Pack 6/12 — Inventory + Shipping", () => {
  it("creates inventory", () => {
    const item = ensureInventory("p1", 10);

    expect(item.stock).toBe(10);
  });

  it("reserves inventory", () => {
    ensureInventory("p2", 20);

    const item = reserveInventory("p2", 5);

    expect(item.stock).toBe(15);
    expect(item.reserved).toBe(5);
  });

  it("releases inventory", () => {
    ensureInventory("p3", 10);
    reserveInventory("p3", 4);

    const item = releaseInventory("p3", 2);

    expect(item.stock).toBe(8);
  });
});
