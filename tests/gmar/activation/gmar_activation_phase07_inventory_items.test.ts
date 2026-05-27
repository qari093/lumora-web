import { createInitialGmarGameState } from "@/src/core/gmar/state/gameState";

import {
  GMAR_ITEM_REGISTRY,
  getGmarItemDefinition,
  grantGmarInventoryItem,
  assertGmarInventory
} from "@/src/core/gmar/inventory-active/items";

describe("GMAR Activation Phase 07 — Inventory + Items", () => {
  it("locks item registry", () => {
    expect(GMAR_ITEM_REGISTRY.starter_pulse_blade?.rarity).toBe("common");
    expect(GMAR_ITEM_REGISTRY.origin_crystal?.rarity).toBe("rare");
    expect(getGmarItemDefinition("signal_boost").category).toBe("boost");
  });

  it("grants stackable item", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    const updated = grantGmarInventoryItem({
      state,
      itemId: "origin_crystal",
      quantity: 3
    });

    expect(updated.inventory.find(item => item.itemId === "origin_crystal")?.quantity).toBe(3);
    expect(assertGmarInventory(updated)).toBe(true);
  });

  it("rejects unknown item", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      grantGmarInventoryItem({
        state,
        itemId: "missing_item"
      })
    ).toThrow("GMAR item not found.");
  });

  it("rejects duplicate non-stackable item", () => {
    const state = createInitialGmarGameState({
      userId: "user_001"
    });

    expect(() =>
      grantGmarInventoryItem({
        state,
        itemId: "starter_pulse_blade"
      })
    ).toThrow("GMAR non-stackable item already owned.");
  });
});
