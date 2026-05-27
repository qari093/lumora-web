export type InventoryRecord = {
  productId: string;
  stock: number;
  reserved: number;
};

const inventory = new Map<string, InventoryRecord>();

export function ensureInventory(productId: string, stock = 0) {
  if (!inventory.has(productId)) {
    inventory.set(productId, {
      productId,
      stock,
      reserved: 0,
    });
  }

  return inventory.get(productId)!;
}

export function reserveInventory(productId: string, qty: number) {
  const item = ensureInventory(productId);

  if (item.stock < qty) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  item.stock -= qty;
  item.reserved += qty;

  return item;
}

export function releaseInventory(productId: string, qty: number) {
  const item = ensureInventory(productId);

  item.stock += qty;
  item.reserved = Math.max(0, item.reserved - qty);

  return item;
}
