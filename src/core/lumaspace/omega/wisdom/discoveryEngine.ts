import type { WisdomBeacon, WisdomTopic } from "./types";
import { beaconIsDiscoverable } from "./beaconEngine";

export function searchWisdomBeacons(input: {
  beacons: WisdomBeacon[];
  topic?: WisdomTopic;
  query?: string;
}): WisdomBeacon[] {
  const q = input.query?.trim().toLowerCase();

  return input.beacons
    .filter(beaconIsDiscoverable)
    .filter((beacon) => !input.topic || beacon.topic === input.topic)
    .filter((beacon) => !q || `${beacon.title} ${beacon.body}`.toLowerCase().includes(q))
    .sort((a, b) => b.trustScore + b.appreciationCount - (a.trustScore + a.appreciationCount));
}
