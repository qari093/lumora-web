export type LumoraLicenseKind =
  | "public-domain"
  | "cc0"
  | "cc-by-3.0"
  | "cc-by-4.0"
  | "platform-safe"
  | "owned-license";

export type LicenseDecision = {
  ok: boolean;
  normalized: LumoraLicenseKind | null;
  attributionRequired: boolean;
  commercialUseAllowed: boolean;
  reason: string;
};

export const LUMORA_LICENSE_WHITELIST: LumoraLicenseKind[] = [
  "public-domain",
  "cc0",
  "cc-by-3.0",
  "cc-by-4.0",
  "platform-safe",
  "owned-license",
];

export const LUMORA_LICENSE_BLOCKLIST = [
  "non-commercial",
  "cc-by-nc",
  "cc by-nc",
  "editorial only",
  "all rights reserved",
  "unknown",
  "educational only",
  "research only",
  "no derivatives",
  "cc-by-nd",
  "cc by-nd",
];
