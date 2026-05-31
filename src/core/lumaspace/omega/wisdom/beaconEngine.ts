import type { WisdomBeacon } from "./types";

export function createWisdomBeacon(input: WisdomBeacon): WisdomBeacon {
  if (!input.id.trim()) throw new Error("wisdom_beacon_id_required");
  if (!input.authorId.trim()) throw new Error("authorId_required");
  if (!input.title.trim()) throw new Error("title_required");
  if (input.body.trim().length < 12) throw new Error("wisdom_body_too_short");

  return {
    ...input,
    trustScore: Math.max(0, Math.min(100, input.trustScore)),
    appreciationCount: Math.max(0, input.appreciationCount),
  };
}

export function beaconIsDiscoverable(beacon: WisdomBeacon): boolean {
  return beacon.humanRecorded && beacon.trustScore >= 60 && beacon.visibility === "public";
}
