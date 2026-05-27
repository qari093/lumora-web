import { describe, expect, it } from "vitest";
import { lowEgoEmotion } from "@/src/core/fyp-intelligence/emotion/lowEgoEmotion";
import { rankingValidator } from "@/src/core/fyp-intelligence/ranking/rankingValidator";

describe("fyp session safety", () => {
  it("uses low ego emotion model", () => {
    expect(lowEgoEmotion.neverClaimsTrueFeeling).toBe(true);
  });

  it("validates ranking score", () => {
    expect(rankingValidator(88).valid).toBe(true);
  });
});
