import type { NativeFypSourceType } from "../policy";

export type NativeFypRightsStatus =
  | "declared"
  | "verified"
  | "rejected"
  | "expired"
  | "unknown";

export type NativeFypLicenseType =
  | "owned"
  | "creator_grant"
  | "royalty_free"
  | "creative_commons_commercial"
  | "direct_license"
  | "lumora_generated";

export type NativeFypRightsDeclaration = {
  videoId: string;
  sourceType: NativeFypSourceType;
  rightsStatus: NativeFypRightsStatus;
  licenseType: NativeFypLicenseType;
  declaredByUserId: string;
  declaredAt: string;
  expiresAt?: string;
  evidenceUrl?: string;
};
