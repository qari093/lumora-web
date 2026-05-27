import { describe, expect, it } from "vitest";

import {
  createEchoImprint
} from "@/src/core/fyp/imprints/echoEngine";

import {
  calculateResonanceScore,
  assertHighResonance
} from "@/src/core/fyp/resonance/resonanceScore";

import {
  generateEchoFingerprint
} from "@/src/core/fyp/imprints/fingerprint";

import {
  calculateLongevityWeight,
  qualifiesForLegacyRotation
} from "@/src/core/fyp/resonance/longevity";

import {
  calculateImpactQuotient
} from "@/src/core/fyp/resonance/impactQuotient";

describe("Lumora FYP Echo Imprints + Resonance", () => {
  it("creates echo imprint", () => {
    const imprint = createEchoImprint({
      contentId: "vid_1",
      emotion: "moved",
      mode: "drift",
      intensity: 88,
      now: 100
    });

    expect(imprint.contentId).toBe("vid_1");
    expect(imprint.intensity).toBe(88);
  });

  it("calculates resonance score", () => {
    const profile = calculateResonanceScore({
      contentId: "vid_1",
      imprintCount: 12,
      replayCount: 30,
      saveCount: 15,
      capsuleCount: 4
    });

    expect(profile.resonanceScore).toBeGreaterThan(0);
    expect(assertHighResonance(profile)).toBe(true);
  });

  it("generates echo fingerprint", () => {
    const fingerprint = generateEchoFingerprint([
      createEchoImprint({
        contentId: "vid_1",
        emotion: "moved",
        mode: "drift",
        intensity: 90,
        now: 100
      }),
      createEchoImprint({
        contentId: "vid_1",
        emotion: "moved",
        mode: "drift",
        intensity: 80,
        now: 101
      })
    ]);

    expect(fingerprint.dominantEmotion).toBe("moved");
    expect(fingerprint.imprintDensity).toBe(2);
  });

  it("calculates longevity resonance", () => {
    const weight = calculateLongevityWeight({
      contentId: "vid_1",
      ageHours: 240,
      replayAfter48h: 7,
      recurringSaves: 4
    });

    expect(weight).toBeGreaterThan(0);

    expect(
      qualifiesForLegacyRotation({
        contentId: "vid_1",
        ageHours: 240,
        replayAfter48h: 7,
        recurringSaves: 4
      })
    ).toBe(true);
  });

  it("calculates impact quotient", () => {
    const profile = calculateResonanceScore({
      contentId: "vid_1",
      imprintCount: 20,
      replayCount: 30,
      saveCount: 10,
      capsuleCount: 5
    });

    const iq = calculateImpactQuotient({
      profile,
      velocity: 40,
      emotionalDepth: 30
    });

    expect(iq.quotient).toBeGreaterThan(100);
  });
});
