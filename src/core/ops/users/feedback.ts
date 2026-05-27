export type FeedbackCategory =
  | "onboarding"
  | "creator-satisfaction"
  | "fan-retention"
  | "payment"
  | "upload"
  | "share-link"
  | "save-moment";

export function captureAlphaFeedback(input: {
  userId: string;
  category: FeedbackCategory;
  message: string;
}) {
  return {
    ...input,
    capturedAt: new Date().toISOString(),
  };
}
