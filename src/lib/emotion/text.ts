export type TextEmotion = "joy" | "surprise" | "sadness" | "anger" | "neutral";
export type TextSentiment = "positive" | "negative" | "neutral";

export type TextEmotionAnalysis = {
  sentiment: TextSentiment;
  emotion: TextEmotion;
  score: number;
};

const POSITIVE = new Set([
  "amazing", "awesome", "beautiful", "best", "excited", "fun",
  "good", "great", "happy", "joy", "love", "wonderful", "wow",
]);

const NEGATIVE = new Set([
  "angry", "awful", "bad", "hate", "horrible", "sad", "terrible",
  "upset", "worst",
]);

const SURPRISE = new Set(["surprise", "surprising", "unexpected", "wow", "shocking"]);

export function analyzeText(input: string): TextEmotionAnalysis {
  const words = String(input ?? "")
    .toLowerCase()
    .match(/[a-z0-9]+/g) ?? [];

  let positive = 0;
  let negative = 0;
  let surprise = 0;

  for (const word of words) {
    if (POSITIVE.has(word)) positive += 1;
    if (NEGATIVE.has(word)) negative += 1;
    if (SURPRISE.has(word)) surprise += 1;
  }

  const raw = positive - negative;
  const sentiment: TextSentiment =
    raw > 0 ? "positive" : raw < 0 ? "negative" : "neutral";

  const emotion: TextEmotion =
    surprise > 0
      ? "surprise"
      : positive > negative
        ? "joy"
        : negative > positive
          ? "sadness"
          : "neutral";

  const denominator = Math.max(1, positive + negative);
  const score = Math.max(-1, Math.min(1, raw / denominator));

  return { sentiment, emotion, score };
}
