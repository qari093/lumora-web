export type BeaconKind = "community" | "person" | "mission" | "wisdom" | "shared_world";

export type DiscoveryBeacon = {
  id: string;
  kind: BeaconKind;
  targetId: string;
  title: string;
  interestTags: string[];
  trustScore: number;
  noveltyScore: number;
  activityScore: number;
  partiallyHidden: boolean;
};

export type ExplorerPath = {
  id: string;
  citizenId: string;
  beaconIds: string[];
  currentIndex: number;
  completed: boolean;
};

export type ExplorerBadge = {
  id: string;
  citizenId: string;
  beaconId: string;
  badge: "first_explorer" | "pathfinder" | "signal_seeker";
};
