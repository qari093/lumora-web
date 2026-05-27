import type {
  DiscoveryLane,
  DiscoveryResult
} from "../types";

import { createDiscoverySeed } from "./discoverySeed";
import { rankDiscoveryItems } from "./discoveryRanker";

export function runDiscovery(
  lane: DiscoveryLane
): DiscoveryResult {
  return {
    ok: true,
    lane,
    items: rankDiscoveryItems(
      createDiscoverySeed(),
      lane
    )
  };
}
