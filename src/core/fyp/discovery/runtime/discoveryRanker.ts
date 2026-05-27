import type {
  DiscoveryItem,
  DiscoveryLane
} from "../types";

import { validateDiscoveryItem } from "../contracts/discoveryContract";

export function rankDiscoveryItems(
  items: DiscoveryItem[],
  lane?: DiscoveryLane
): DiscoveryItem[] {
  return items
    .filter((item) => validateDiscoveryItem(item))
    .filter((item) => !lane || item.lane === lane)
    .sort((a, b) => b.score - a.score);
}
