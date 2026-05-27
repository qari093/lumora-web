export type RecoveryState = "active" | "resting" | "recovering" | "sanctuary";
export type NotificationMode = "normal" | "quiet" | "silent";
export type OverloadLevel = "safe" | "watch" | "reduce" | "pause";

export interface CreatorActivityState {
  creatorId: string;
  daysSincePost: number;
  recentPostFrequency: number;
  emotionalLoad: number;
  sanctuaryRequested: boolean;
}

export interface RecoveryDecision {
  state: RecoveryState;
  softDecayMultiplier: number;
  notificationMode: NotificationMode;
  preserveSeed: boolean;
  substituteSimilarCreators: boolean;
}

export interface EmotionalOverloadInput {
  insightsShownThisWeek: number;
  ritualsShownThisMonth: number;
  atmospheresShownThisWeek: number;
  creatorDismissals: number;
}

export interface EmotionalOverloadResult {
  level: OverloadLevel;
  suppressInsights: boolean;
  suppressRituals: boolean;
  reason: string;
}
