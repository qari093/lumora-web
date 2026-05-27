export type Fyp94LicenseType =
  | "royalty_free_commercial"
  | "creator_grant"
  | "partner_license"
  | "lumora_owned";

export type Fyp94LicenseRule = {
  type: Fyp94LicenseType;
  commercialUseAllowed: boolean;
  modificationAllowed: boolean;
  attributionRequired: boolean;
};

export const FYP94_LICENSE_REGISTRY: Record<Fyp94LicenseType, Fyp94LicenseRule> = {
  royalty_free_commercial: {
    type: "royalty_free_commercial",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
  },
  creator_grant: {
    type: "creator_grant",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
  },
  partner_license: {
    type: "partner_license",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
  },
  lumora_owned: {
    type: "lumora_owned",
    commercialUseAllowed: true,
    modificationAllowed: true,
    attributionRequired: false,
  },
};

export function getFyp94LicenseRule(type: Fyp94LicenseType): Fyp94LicenseRule {
  return FYP94_LICENSE_REGISTRY[type];
}
