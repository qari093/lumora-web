import type { NativeFypLicenseType } from "./types";

export type LicenseRule = {
  type: NativeFypLicenseType;
  commercialUseAllowed: boolean;
  attributionRequired: boolean;
  expiryRequired: boolean;
};

export const NATIVE_FYP_LICENSE_REGISTRY: Record<NativeFypLicenseType, LicenseRule> = {
  owned: {
    type: "owned",
    commercialUseAllowed: true,
    attributionRequired: false,
    expiryRequired: false,
  },
  creator_grant: {
    type: "creator_grant",
    commercialUseAllowed: true,
    attributionRequired: false,
    expiryRequired: false,
  },
  royalty_free: {
    type: "royalty_free",
    commercialUseAllowed: true,
    attributionRequired: true,
    expiryRequired: false,
  },
  creative_commons_commercial: {
    type: "creative_commons_commercial",
    commercialUseAllowed: true,
    attributionRequired: true,
    expiryRequired: false,
  },
  direct_license: {
    type: "direct_license",
    commercialUseAllowed: true,
    attributionRequired: true,
    expiryRequired: true,
  },
  lumora_generated: {
    type: "lumora_generated",
    commercialUseAllowed: true,
    attributionRequired: false,
    expiryRequired: false,
  },
};

export function getLicenseRule(type: NativeFypLicenseType): LicenseRule {
  return NATIVE_FYP_LICENSE_REGISTRY[type];
}
