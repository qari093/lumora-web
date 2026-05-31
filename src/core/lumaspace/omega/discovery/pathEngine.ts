import type { DiscoveryBeacon, ExplorerBadge, ExplorerPath } from "./types";
import { scoreDiscoveryBeacon } from "./beaconEngine";

export function createExplorerPath(input: {
  citizenId: string;
  beacons: DiscoveryBeacon[];
  userTags: string[];
}): ExplorerPath {
  const ranked = [...input.beacons]
    .sort((a, b) => scoreDiscoveryBeacon(b, input.userTags) - scoreDiscoveryBeacon(a, input.userTags))
    .slice(0, 7);

  return {
    id: `explorer_path_${input.citizenId}_${Date.now()}`,
    citizenId: input.citizenId,
    beaconIds: ranked.map((beacon) => beacon.id),
    currentIndex: 0,
    completed: ranked.length === 0,
  };
}

export function advanceExplorerPath(path: ExplorerPath): ExplorerPath {
  const nextIndex = path.currentIndex + 1;
  return {
    ...path,
    currentIndex: Math.min(nextIndex, path.beaconIds.length),
    completed: nextIndex >= path.beaconIds.length,
  };
}

export function createExplorerBadge(path: ExplorerPath, beaconId: string): ExplorerBadge {
  return {
    id: `explorer_badge_${path.citizenId}_${beaconId}`,
    citizenId: path.citizenId,
    beaconId,
    badge: path.currentIndex === 0 ? "first_explorer" : "pathfinder",
  };
}
