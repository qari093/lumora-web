export type ModerationSeverity = "safe" | "watch" | "review" | "block";
export type ModerationReason =
  | "safe"
  | "diagnostic_language"
  | "guilt_pressure"
  | "casino_language"
  | "harassment"
  | "self_harm_risk"
  | "emotional_manipulation";

export interface ModerationResult {
  severity: ModerationSeverity;
  reasons: ModerationReason[];
  allow: boolean;
}

export interface ModerationQueueItem {
  id: string;
  source: "whisper" | "gift" | "comment" | "patronage" | "legacy";
  content: string;
  result: ModerationResult;
  createdAt: string;
}
