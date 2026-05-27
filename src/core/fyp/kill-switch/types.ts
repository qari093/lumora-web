export type KillSwitchState =
  | "armed"
  | "survived"
  | "vaulted"
  | "resurrected";

export type KillSwitchAttempt = {
  attemptId: string;
  creatorId: string;
  contentId: string;
  baselineImpact: number;
  activatedAt: number;
  expiresAt: number;
  state: KillSwitchState;
};

export type EchoResurrection = {
  resurrectionId: string;
  creatorId: string;
  contentId: string;
  restored: boolean;
  visibilityPenalty: number;
  survivorBadge: boolean;
};
