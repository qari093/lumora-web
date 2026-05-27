import { describe, expect, it } from "vitest";

import {
  isEmotionSignalType,
  validateEmotionSignal
} from "@/src/core/fyp/emotion/contracts/emotionContract";

import {
  scoreEmotionSignals
} from "@/src/core/fyp/emotion/runtime/emotionScorer";

import {
  runEmotionRuntime
} from "@/src/core/fyp/emotion/runtime/emotionRuntime";

const signals = [
  {
    id: "emotion_1",
    itemId: "item_1",
    emotion: "joy" as const,
    intensity: 80
  },
  {
    id: "emotion_2",
    itemId: "item_1",
    emotion: "awe" as const,
    intensity: 40
  },
  {
    id: "emotion_3",
    itemId: "item_2",
    emotion: "calm" as const,
    intensity: 30
  }
];

describe("Lumora FYP Emotion Runtime Activation", () => {
  it("validates emotion type", () => {
    expect(isEmotionSignalType("joy")).toBe(true);
    expect(isEmotionSignalType("invalid")).toBe(false);
  });

  it("validates emotion signal", () => {
    expect(validateEmotionSignal(signals[0])).toBe(true);
  });

  it("rejects invalid intensity", () => {
    expect(
      validateEmotionSignal({
        ...signals[0],
        intensity: 101
      })
    ).toBe(false);
  });

  it("scores dominant emotion", () => {
    const result =
      scoreEmotionSignals("item_1", signals);

    expect(result.dominantEmotion).toBe("joy");
    expect(result.resonanceScore).toBe(80);
  });

  it("runs emotion runtime", () => {
    const results =
      runEmotionRuntime(
        ["item_1", "item_2"],
        signals
      );

    expect(results).toHaveLength(2);
    expect(results[0].itemId).toBe("item_1");
  });
});
