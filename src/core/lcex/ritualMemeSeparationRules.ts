export type RitualMemeClassification =
  | "ritual"
  | "meme"
  | "hybrid"
  | "unknown";

export type RitualMemeInput = {
  repetitionRate: number;
  templateMutationRate: number;
  symbolicWeight: number;
  socialImitationRate: number;
};

export type RitualMemeResult = {
  classification: RitualMemeClassification;
  score: number;
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function classifyRitualVsMeme(
  input: RitualMemeInput
): RitualMemeResult {
  const ritualSignal = clampScore(
    input.repetitionRate * 0.35 +
      input.symbolicWeight * 0.4 +
      input.socialImitationRate * 0.25
  );

  const memeSignal = clampScore(
    input.templateMutationRate * 0.45 +
      input.socialImitationRate * 0.35 +
      input.repetitionRate * 0.2
  );

  if (ritualSignal >= 70 && memeSignal < 55) {
    return { classification: "ritual", score: ritualSignal };
  }

  if (memeSignal >= 70 && ritualSignal < 55) {
    return { classification: "meme", score: memeSignal };
  }

  if (ritualSignal >= 55 && memeSignal >= 55) {
    return { classification: "hybrid", score: Math.round((ritualSignal + memeSignal) / 2) };
  }

  return { classification: "unknown", score: Math.max(ritualSignal, memeSignal) };
}

export function requiresRitualMemeCare(
  input: RitualMemeInput
): boolean {
  const result = classifyRitualVsMeme(input);
  return result.classification === "ritual" || result.classification === "hybrid";
}
