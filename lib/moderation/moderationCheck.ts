export type ModerationInput = {
  text?: string;
  title?: string;
  tags?: string[];
};

export type ModerationResult = {
  allowed: boolean;
  score: number;
  level: "low" | "medium" | "high";
  reasons: string[];
};

const BLOCKLIST = [
  "kill",
  "suicide",
  "self harm",
  "terror",
  "bomb",
  "rape",
  "hate speech",
  "nazi",
];

export function runModerationCheck(input: ModerationInput): ModerationResult {
  const corpus = [
    input.title ?? "",
    input.text ?? "",
    ...(Array.isArray(input.tags) ? input.tags : []),
  ]
    .join(" ")
    .toLowerCase();

  const reasons: string[] = [];
  let score = 0;

  for (const token of BLOCKLIST) {
    if (corpus.includes(token)) {
      reasons.push(`matched:${token}`);
      score += 0.18;
    }
  }

  const normalized = Math.max(0, Math.min(1, Number(score.toFixed(4))));
  const level =
    normalized >= 0.75 ? "high" :
    normalized >= 0.35 ? "medium" :
    "low";

  return {
    allowed: normalized < 0.75,
    score: normalized,
    level,
    reasons,
  };
}
