import { describe, expect, it } from "vitest";
import { revealWitnessNamesPostCircle } from "@/src/lib/creator-system/witness-continuity/revealWitnessNames";
import { countRepeatPresence, hasRepeatPresence, type WitnessPresenceTrace } from "@/src/lib/creator-system/witness-continuity/repeatPresence";
import { buildPrivateWitnessConstellation } from "@/src/lib/creator-system/witness-continuity/witnessConstellation";
import { buildStillWithYouOftenLabel } from "@/src/lib/creator-system/witness-continuity/stillWithYouLabel";
import { getWitnessProfileLinkPolicy } from "@/src/lib/creator-system/witness-continuity/profileLinkGuard";

const traces: WitnessPresenceTrace[] = [
  { creatorId: "c1", witnessId: "w1", circleId: "circle1", createdAt: "2026-05-01T19:00:00.000Z" },
  { creatorId: "c1", witnessId: "w1", circleId: "circle2", createdAt: "2026-05-02T19:00:00.000Z" },
  { creatorId: "c1", witnessId: "w2", circleId: "circle3", createdAt: "2026-05-03T19:00:00.000Z" },
];

describe("Pack16 Witness Continuity", () => {
  it("reveals witness names post-circle only", () => {
    expect(revealWitnessNamesPostCircle({ phase: "during-circle", witnessNames: ["Nova"] }).canReveal).toBe(false);

    const out = revealWitnessNamesPostCircle({ phase: "post-circle", witnessNames: ["Nova", "Willow"] });
    expect(out.canReveal).toBe(true);
    expect(out.names).toContain("Nova");
  });

  it("recognizes repeat presence", () => {
    expect(countRepeatPresence({ creatorId: "c1", witnessId: "w1", traces })).toBe(2);
    expect(hasRepeatPresence({ creatorId: "c1", witnessId: "w1", traces })).toBe(true);
    expect(hasRepeatPresence({ creatorId: "c1", witnessId: "w2", traces })).toBe(false);
  });

  it("builds private witness constellation", () => {
    const constellation = buildPrivateWitnessConstellation({
      creatorId: "c1",
      witnesses: [
        { witnessId: "w1", witnessName: "Nova" },
        { witnessId: "w2", witnessName: "Willow" },
      ],
      traces,
    });

    expect(constellation).toHaveLength(2);
    expect(constellation[0].privateOnly).toBe(true);
    expect(constellation[0].profileLinkingAllowed).toBe(false);
  });

  it("adds still-with-you label", () => {
    expect(buildStillWithYouOftenLabel(5)).toBe("has been still with you often");
    expect(buildStillWithYouOftenLabel(2)).toBe("has returned to your circle");
    expect(buildStillWithYouOftenLabel(1)).toBe(null);
  });

  it("prevents profile/social linking", () => {
    const policy = getWitnessProfileLinkPolicy();

    expect(policy.profileLinksVisible).toBe(false);
    expect(policy.socialLinksVisible).toBe(false);
    expect(policy.directMessagingEnabled).toBe(false);
  });
});
