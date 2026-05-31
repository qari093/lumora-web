import { describe, expect, it } from "vitest";
import { createLocalOrbitConsent, canUseLocalOrbit } from "@/src/core/lumaspace/omega/local-orbit/consentEngine";
import { createLocalMatch, createLocalSignal } from "@/src/core/lumaspace/omega/local-orbit/proximityEngine";
import { runLumaSpaceOmegaMegaPack17Runtime } from "@/src/core/lumaspace/omega/local-orbit/omegaPack17Runtime";

describe("LumaSpace Ω∞ Mega Pack 17 — Local Orbit", () => {
  it("creates expiring consent", () => {
    const consent = createLocalOrbitConsent({ citizenId: "u1", visibility: "city", bridgeMatching: true });
    expect(canUseLocalOrbit(consent)).toBe(true);
  });

  it("creates safe blurred local match", () => {
    const a = createLocalSignal({ id: "a", citizenId: "u1", cityHash: "x", interestTags: ["a"], trustScore: 80, distanceBand: "same_city" });
    const b = createLocalSignal({ id: "b", citizenId: "u2", cityHash: "x", interestTags: ["a"], trustScore: 80, distanceBand: "same_city" });
    const match = createLocalMatch(a, b);

    expect(a.identityBlurred).toBe(true);
    expect(match?.safe).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack17Runtime().ok).toBe(true);
  });
});
