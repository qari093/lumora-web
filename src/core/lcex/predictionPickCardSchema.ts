export type PredictionPickCardSchema = {
  id: string;
  type: "prediction-pick";
  entityId: string;
  title: string;
  prompt: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  confidence: number;
  options: Array<{
    id: string;
    label: string;
  }>;
  closesAt: string;
  createdAt: string;
  region?: string;
  language?: string;
};

export function createPredictionPickCard(
  input: PredictionPickCardSchema
): PredictionPickCardSchema {
  return input;
}

export function isPredictionPickOpen(
  card: PredictionPickCardSchema
): boolean {
  return Date.parse(card.closesAt) > Date.now();
}
