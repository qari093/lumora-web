export type SafetySeverity = "low" | "medium" | "high";

export type SafetySignal = {
  id: string;
  targetId: string;
  targetType: "signal" | "memory" | "circle" | "bridge" | "community";
  severity: SafetySeverity;
  reason: string;
};

export type ModerationDecision = {
  id: string;
  signalId: string;
  action: "allow" | "limit" | "review" | "remove";
  transparent: boolean;
  appealable: boolean;
};

export type TrustProfile = {
  citizenId: string;
  trustScore: number;
  reliabilityScore: number;
  limited: boolean;
};
