export type TrustFeedbackStatus =
  | "open"
  | "reviewed"
  | "resolved"
  | "dismissed";

export type TrustFeedbackRecord = {
  id: string;
  userId: string;
  surface:
    | "discovery"
    | "live-room"
    | "versus"
    | "prediction-pick"
    | "mood-board"
    | "fandom-badge"
    | "identity"
    | "habit";
  sentiment: "positive" | "neutral" | "negative";
  reasonCode: string;
  notes?: string;
  status: TrustFeedbackStatus;
  createdAt: string;
};

export const TRUST_FEEDBACK_REGISTRY: TrustFeedbackRecord[] = [];

export function registerTrustFeedback(
  feedback: TrustFeedbackRecord
): void {
  TRUST_FEEDBACK_REGISTRY.push({
    ...feedback,
    id: feedback.id.trim(),
    userId: feedback.userId.trim(),
    reasonCode: feedback.reasonCode.trim(),
    notes: feedback.notes?.trim(),
  });
}

export function getTrustFeedbackById(
  id: string
): TrustFeedbackRecord | undefined {
  const normalizedId = id.trim();
  return TRUST_FEEDBACK_REGISTRY.find((item) => item.id === normalizedId);
}

export function getOpenTrustFeedback(): TrustFeedbackRecord[] {
  return TRUST_FEEDBACK_REGISTRY.filter((item) => item.status === "open");
}
