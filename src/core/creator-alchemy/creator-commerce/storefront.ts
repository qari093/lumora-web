import type { CreatorCommerceItem, CreatorCommerceStorefront } from "./types";

export function createCreatorCommerceItem(input: CreatorCommerceItem): CreatorCommerceItem {
  return {
    ...input,
    price: Math.max(0, input.price)
  };
}

export function buildCreatorCommerceStorefront(input: {
  creatorId: string;
  zendoroReady: boolean;
  items: CreatorCommerceItem[];
}): CreatorCommerceStorefront {
  const safeItems = input.items.filter((item) => item.safetyApproved);

  return {
    creatorId: input.creatorId,
    zendoroReady: input.zendoroReady,
    enabled: input.zendoroReady && safeItems.length > 0,
    items: safeItems
  };
}
