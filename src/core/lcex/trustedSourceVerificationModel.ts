import type { TrustState } from "./trustState";

export type VerificationMethod =
  | "domain-match"
  | "manual-ops-review"
  | "partner-contract"
  | "platform-verification"
  | "editorial-allowlist";

export type TrustedSourceVerificationRecord = {
  sourceId: string;
  domain: string;
  trustState: TrustState;
  verified: boolean;
  verificationMethod: VerificationMethod;
  verifiedAt?: string;
  reviewedBy?: string;
  notes?: string;
};

export function isVerifiedTrustedSource(
  record: TrustedSourceVerificationRecord
): boolean {
  return (
    record.verified === true &&
    (record.trustState === "official" ||
      record.trustState === "verified" ||
      record.trustState === "partner-approved" ||
      record.trustState === "trusted-editorial")
  );
}

export function requiresManualVerification(
  record: TrustedSourceVerificationRecord
): boolean {
  return (
    !record.verified ||
    record.trustState === "community-signal" ||
    record.trustState === "unverified" ||
    record.trustState === "suppressed"
  );
}
