export type TrustSignal = {
  creatorId: string;
  authenticityScore: number;
  communityConfidence: number;
  longevityScore: number;
};

export type TrustProfile = {
  creatorId: string;
  trustScore: number;
  verified: boolean;
  protected: boolean;
};

export type SafetyDecision =
  | "allow"
  | "limit"
  | "review"
  | "block";

export type PrivacyMode =
  | "public"
  | "friends"
  | "ghost"
  | "phantom";
