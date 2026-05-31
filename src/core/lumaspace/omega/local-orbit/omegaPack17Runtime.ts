import { createLocalOrbitConsent, canUseLocalOrbit } from "./consentEngine";
import { createLocalMatch, createLocalSignal } from "./proximityEngine";

export function runLumaSpaceOmegaMegaPack17Runtime() {
  const consent = createLocalOrbitConsent({
    citizenId: "citizen-017",
    visibility: "city",
    bridgeMatching: true,
  });

  const a = createLocalSignal({
    id: "local-a",
    citizenId: "citizen-017",
    cityHash: "city-bonn",
    interestTags: ["creation", "learning"],
    trustScore: 88,
    distanceBand: "same_city",
  });

  const b = createLocalSignal({
    id: "local-b",
    citizenId: "citizen-017-b",
    cityHash: "city-bonn",
    interestTags: ["learning", "wellness"],
    trustScore: 91,
    distanceBand: "same_city",
  });

  const match = createLocalMatch(a, b);

  return {
    ok:
      canUseLocalOrbit(consent) &&
      a.identityBlurred &&
      b.identityBlurred &&
      match?.safe === true &&
      match.sharedTags.includes("learning"),
    consent,
    a,
    b,
    match,
  };
}
