import { describe, expect, it } from "vitest";
import { isLikelyBadOpeningScene, rejectIntroOrCreditsScene } from "@/src/lib/content/scene/sceneRejector";
import { scoreScene } from "@/src/lib/content/scene/sceneScoring";
import { filterHighQualityScenes, validateClipSceneQuality } from "@/src/lib/content/scene/clipQualityGate";

describe("Lumora Pack 09 — clip quality + scene intelligence gate", () => {
  it("rejects intro and credit scenes", () => {
    expect(rejectIntroOrCreditsScene({ hasIntroText: true })).toContain("intro_text_detected");
    expect(rejectIntroOrCreditsScene({ hasCreditsText: true })).toContain("credits_text_detected");
    expect(isLikelyBadOpeningScene({ hasBlackFrames: true })).toBe(true);
  });

  it("accepts strong narrative scenes", () => {
    const out = scoreScene({
      hasHumanPresence: true,
      hasNarrativeAction: true,
      hasStrongMotion: true,
      audioEnergyDb: -20,
      durationSeconds: 30,
    });

    expect(out.ok).toBe(true);
    expect(out.score).toBeGreaterThanOrEqual(60);
  });

  it("rejects weak audio title-like scenes", () => {
    const out = validateClipSceneQuality({
      id: "bad",
      hasCreditsText: true,
      audioEnergyDb: -60,
      durationSeconds: 18,
    });

    expect(out.ok).toBe(false);
    expect(out.reasons).toContain("credits_text_detected");
  });

  it("filters only high quality scenes", () => {
    const out = filterHighQualityScenes([
      {
        id: "good",
        hasHumanPresence: true,
        hasNarrativeAction: true,
        hasStrongMotion: true,
        audioEnergyDb: -18,
        durationSeconds: 30,
      },
      {
        id: "bad",
        hasIntroText: true,
        audioEnergyDb: -60,
        durationSeconds: 18,
      },
    ]);

    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("good");
  });
});
