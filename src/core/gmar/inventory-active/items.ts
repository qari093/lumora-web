import type {
  GmarGameState,
  GmarInventoryItem
} from "@/src/core/gmar/state/gameState";

export type GmarItemRarity = "common" | "rare" | "epic" | "legendary";

export type GmarItemDefinition = {
  itemId: string;
  name: string;
  rarity: GmarItemRarity;
  category: "weapon" | "cosmetic" | "resource" | "boost";
  stackable: boolean;
};

export const GMAR_ITEM_REGISTRY: Record<string, GmarItemDefinition> = {
  starter_pulse_blade: {
    itemId: "starter_pulse_blade",
    name: "Starter Pulse Blade",
    rarity: "common",
    category: "weapon",
    stackable: false
  },
  origin_crystal: {
    itemId: "origin_crystal",
    name: "Origin Crystal",
    rarity: "rare",
    category: "resource",
    stackable: true
  },
  signal_boost: {
    itemId: "signal_boost",
    name: "Signal Boost",
    rarity: "common",
    category: "boost",
    stackable: true
  }
};

export function getGmarItemDefinition(itemId: string): GmarItemDefinition {
  const item = GMAR_ITEM_REGISTRY[itemId];

  if (!item) {
    throw new Error("GMAR item not found.");
  }

  return item;
}

export function grantGmarInventoryItem(input: {
  state: GmarGameState;
  itemId: string;
  quantity?: number;
  equipped?: boolean;
}): GmarGameState {
  const item = getGmarItemDefinition(input.itemId);
  const quantity = input.quantity ?? 1;

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("GMAR item quantity must be positive.");
  }

  const existing = input.state.inventory.find(
    entry => entry.itemId === item.itemId
  );

  let inventory: GmarInventoryItem[];

  if (existing && item.stackable) {
    inventory = input.state.inventory.map(entry =>
      entry.itemId === item.itemId
        ? {
            ...entry,
            quantity: entry.quantity + quantity,
            equipped: input.equipped ?? entry.equipped
          }
        : entry
    );
  } else if (existing && !item.stackable) {
    throw new Error("GMAR non-stackable item already owned.");
  } else {
    inventory = [
      ...input.state.inventory,
      {
        itemId: item.itemId,
        quantity,
        equipped: input.equipped ?? false
      }
    ];
  }

  return {
    ...input.state,
    inventory,
    updatedAt: new Date().toISOString()
  };
}

export function assertGmarInventory(state: GmarGameState): true {
  if (
    state.inventory.length < 1 ||
    state.inventory.some(item => !GMAR_ITEM_REGISTRY[item.itemId]) ||
    state.inventory.some(item => item.quantity < 1)
  ) {
    throw new Error("Invalid GMAR inventory.");
  }

  return true;
}
