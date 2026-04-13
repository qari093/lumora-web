export type PredictionOutcomeStatus =
  | "pending"
  | "hit"
  | "miss"
  | "partial"
  | "expired";

export type PredictionOutcomeRecord = {
  id: string;
  predictionId: string;
  entityId: string;
  prompt: string;
  predictedOptionId: string;
  resolvedOptionId?: string;
  status: PredictionOutcomeStatus;
  confidence: number;
  createdAt: string;
  resolvedAt?: string;
};

export function createPredictionOutcomeRecord(
  input: Omit<PredictionOutcomeRecord, "status">
): PredictionOutcomeRecord {
  return {
    ...input,
    status: "pending",
  };
}

export function resolvePredictionOutcome(
  record: PredictionOutcomeRecord,
  resolvedOptionId: string
): PredictionOutcomeRecord {
  return {
    ...record,
    resolvedOptionId,
    status:
      record.predictedOptionId === resolvedOptionId
        ? "hit"
        : "miss",
    resolvedAt: new Date().toISOString(),
  };
}

export function isPredictionResolved(
  record: PredictionOutcomeRecord
): boolean {
  return record.status !== "pending";
}
