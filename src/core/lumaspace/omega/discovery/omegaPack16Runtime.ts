import { createDiscoveryBeacon, scoreDiscoveryBeacon } from "./beaconEngine";
import { advanceExplorerPath, createExplorerBadge, createExplorerPath } from "./pathEngine";

export function runLumaSpaceOmegaMegaPack16Runtime() {
  const beacons = [
    createDiscoveryBeacon({
      id: "beacon-creator",
      kind: "community",
      targetId: "community-creator",
      title: "Creator Hearth",
      interestTags: ["creation", "video"],
      trustScore: 88,
      noveltyScore: 75,
      activityScore: 90,
      partiallyHidden: true,
    }),
    createDiscoveryBeacon({
      id: "beacon-wisdom",
      kind: "wisdom",
      targetId: "wisdom-001",
      title: "Quiet Builder Wisdom",
      interestTags: ["building", "learning"],
      trustScore: 94,
      noveltyScore: 70,
      activityScore: 65,
      partiallyHidden: true,
    }),
  ];

  let path = createExplorerPath({
    citizenId: "citizen-016",
    beacons,
    userTags: ["creation", "building"],
  });

  const badge = createExplorerBadge(path, path.beaconIds[0]);
  path = advanceExplorerPath(path);
  path = advanceExplorerPath(path);

  return {
    ok:
      beacons.every((beacon) => beacon.partiallyHidden) &&
      scoreDiscoveryBeacon(beacons[0], ["creation"]) > 0 &&
      badge.badge === "first_explorer" &&
      path.completed,
    beacons,
    path,
    badge,
  };
}
