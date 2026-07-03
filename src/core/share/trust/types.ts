export type TrustDecision = "allow" | "limit" | "block" | "review";
export type PrivacyAudience = "self" | "friends" | "family" | "group" | "community" | "public" | "external";
export type SafetySignalKind =
  | "spam"
  | "scam"
  | "abuse"
  | "sensitive_content"
  | "copyright_risk"
  | "malware_risk"
  | "blocked_actor"
  | "consent_missing"
  | "rate_limit";

export type TrustPolicy = {
  actorId: string;
  recipientId?: string;
  minTrustScore: number;
  allowExternal: boolean;
  requireConsent: boolean;
  blockedActorIds: string[];
  mutedActorIds: string[];
};

export type PrivacyPolicy = {
  ownerId: string;
  audience: PrivacyAudience;
  allowedActorIds: string[];
  deniedActorIds: string[];
  expiresAt?: string;
  revocable: boolean;
};

export type SafetySignal = {
  id: string;
  kind: SafetySignalKind;
  score: number;
  reason: string;
};

export type TrustSafetyResult = {
  decision: TrustDecision;
  trustScore: number;
  signals: SafetySignal[];
  requiredActions: string[];
};

export type TrustAuditEntry = {
  id: string;
  actorId: string;
  objectId: string;
  decision: TrustDecision;
  reason: string;
  at: string;
};
