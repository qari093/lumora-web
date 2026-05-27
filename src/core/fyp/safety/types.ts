export type SafetyRiskLevel =
  | "allow"
  | "review"
  | "block";

export type SafetyInput = {
  itemId: string;
  title: string;
  source: string;
  tags: string[];
  hasLicenseProof: boolean;
};

export type SafetyDecision = {
  itemId: string;
  level: SafetyRiskLevel;
  reasons: string[];
  allowed: boolean;
};
