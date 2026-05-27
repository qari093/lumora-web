import type { LumoraLetter, LumoraLetterInput } from "./types";

const UNSAFE_PATTERNS = [
  "you owe",
  "come back",
  "we need you",
  "don't leave",
  "save us"
];

export function buildLumoraLetter(input: LumoraLetterInput): LumoraLetter {
  const safeLines = input.anonymousLines
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => !UNSAFE_PATTERNS.some((pattern) => line.toLowerCase().includes(pattern)))
    .slice(0, 12);

  return {
    eligible: input.anniversaryEligible && safeLines.length >= 3,
    creatorId: input.creatorId,
    lines: input.anniversaryEligible ? safeLines : []
  };
}
