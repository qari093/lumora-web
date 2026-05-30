export const GMAR_ITEM_REGISTRY = {
  starter_pulse_blade: {
    itemId: "starter_pulse_blade",
    rarity: "common",
    category: "weapon",
    stackable: false
  },
  origin_crystal: {
    itemId: "origin_crystal",
    rarity: "rare",
    category: "material",
    stackable: true
  },
  signal_boost: {
    itemId: "signal_boost",
    rarity: "common",
    category: "boost",
    stackable: true
  }
} as const;

export function getGmarItemDefinition(itemId: string) {
  const item = (GMAR_ITEM_REGISTRY as any)[itemId];
  if (!item) throw new Error("GMAR item not found.");
  return item;
}

export function grantGmarInventoryItem(input: any) {
  const state = input?.state ?? {};
  const inventory = Array.isArray(state.inventory) ? state.inventory : [];
  const item = getGmarItemDefinition(String(input?.itemId ?? ""));
  const quantity = Number(input?.quantity ?? 1);
  const existing = inventory.find((entry: any) => entry.itemId === item.itemId);

  if (existing && !item.stackable) {
    throw new Error("GMAR non-stackable item already owned.");
  }

  const nextInventory = existing
    ? inventory.map((entry: any) =>
        entry.itemId === item.itemId
          ? { ...entry, quantity: Number(entry.quantity ?? 0) + quantity }
          : entry
      )
    : [...inventory, { ...item, quantity, equipped: item.itemId === "starter_pulse_blade" }];

  return { ...state, inventory: nextInventory };
}

export function assertGmarInventory(state: any): boolean {
  return Array.isArray(state?.inventory) && state.inventory.length > 0;
}

export const assertGmarInventoryState = assertGmarInventory;

