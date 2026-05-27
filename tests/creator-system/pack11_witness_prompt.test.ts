import { describe, expect, it } from "vitest";
import { detectPassiveSilence } from "@/src/lib/creator-system/witness-prompt/passiveSilence";
import { isWitnessPromptWord } from "@/src/lib/creator-system/witness-prompt/oneWordPrompt";
import { createWitnessPromptResponse } from "@/src/lib/creator-system/witness-prompt/promptResponse";
import { aggregateRoomTemperature } from "@/src/lib/creator-system/witness-prompt/roomTemperature";
import { cleanWitnessPromptLanguage } from "@/src/lib/creator-system/witness-prompt/judgmentGuard";

describe("Pack11 Witness Prompt", () => {
  it("detects passive silence", () => {
    expect(detectPassiveSilence({ watchMs: 9000, signalCount: 0, videoDurationMs: 12000 }).passiveSilence).toBe(true);
    expect(detectPassiveSilence({ watchMs: 9000, signalCount: 1, videoDurationMs: 12000 }).passiveSilence).toBe(false);
  });

  it("supports one-word prompt vocabulary", () => {
    expect(isWitnessPromptWord("warm")).toBe(true);
    expect(isWitnessPromptWord("judged")).toBe(false);
  });

  it("creates valid witness prompt responses", () => {
    const response = createWitnessPromptResponse({
      circleId: "c1",
      witnessId: "w1",
      videoId: "v1",
      word: "curious",
    });

    expect(response.word).toBe("curious");
  });

  it("aggregates room temperature", () => {
    const responses = [
      createWitnessPromptResponse({ circleId: "c1", witnessId: "w1", videoId: "v1", word: "warm" }),
      createWitnessPromptResponse({ circleId: "c1", witnessId: "w2", videoId: "v1", word: "warm" }),
      createWitnessPromptResponse({ circleId: "c1", witnessId: "w3", videoId: "v1", word: "still" }),
    ];

    const room = aggregateRoomTemperature(responses);
    expect(room.dominant).toBe("warm");
    expect(room.counts.warm).toBe(2);
  });

  it("rejects judgment language", () => {
    expect(cleanWitnessPromptLanguage("still and warm").ok).toBe(true);
    expect(cleanWitnessPromptLanguage("this was bad").ok).toBe(false);
  });
});
