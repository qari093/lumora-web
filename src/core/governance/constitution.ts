export const constitutionLocked = true;

export const LUMORA_PLATFORM_CONSTITUTION_ID =
  "lumora.platform.constitution" as const;

export const LUMORA_PLATFORM_CONSTITUTION_VERSION = "1.0.0" as const;

export type ConstitutionalRight =
  | "dignity"
  | "equal_treatment"
  | "privacy"
  | "meaningful_explanation"
  | "human_review"
  | "remedy_and_appeal"
  | "proportionality"
  | "data_portability";

export type ConstitutionalActor =
  | "member"
  | "steward"
  | "guardian"
  | "council"
  | "operator"
  | "company";

export type ConstitutionalAuthorityBoundary = {
  communityMembershipIsNotLegalCitizenship: true;
  communityGovernanceDoesNotCreateStateAuthority: true;
  platformRemainsCommercialLegalEntity: true;
  corporateLegalDutiesRemainWithAuthorizedLegalActors: true;
  popularityDoesNotCreateAuthority: true;
  wealthDoesNotCreateAuthority: true;
  followerCountDoesNotCreateAuthority: true;
  tokenBalanceDoesNotCreateAuthority: true;
};

export type ConstitutionalAmendmentPolicy = {
  versionBumpRequired: true;
  publicChangeRecordRequired: true;
  reasonRequired: true;
  effectiveDateRequired: true;
  rightsImpactReviewRequired: true;
  conflictsOfInterestMustBeDisclosed: true;
  affectedPowerHolderCannotUnilaterallyVeto: true;
  publishedHistoryCannotBeSilentlyRewritten: true;
};

export type ConstitutionalHistoryPolicy = {
  appendOnlyPublishedHistoryRequired: true;
  immutablePublishedVersionIdentifiers: true;
  cryptographicDigestRequiredForSealedVersions: true;
  previousVersionReferenceRequired: true;
  silentHistoryRewriteForbidden: true;
};

export const LUMORA_PLATFORM_CONSTITUTION = Object.freeze({
  id: LUMORA_PLATFORM_CONSTITUTION_ID,
  version: LUMORA_PLATFORM_CONSTITUTION_VERSION,
  status: "FOUNDATIONAL_BASELINE_ACTIVE" as const,

  scope: Object.freeze({
    platformWide: true,
    currentStage: "founder_private_beta_foundation" as const,
    deeperGovernanceActivationMaturityGated: true,
  }),

  terminology: Object.freeze({
    citizenMeansCommunityMember: true,
    citizenDoesNotMeanLegalNationality: true,
    citizenDoesNotMeanStateCitizenship: true,
    lumoraIsNotAStateOrSovereignGovernment: true,
  }),

  fundamentalRights: Object.freeze<readonly ConstitutionalRight[]>([
    "dignity",
    "equal_treatment",
    "privacy",
    "meaningful_explanation",
    "human_review",
    "remedy_and_appeal",
    "proportionality",
    "data_portability",
  ]),

  irreducibleBaseline: Object.freeze({
    dignityMustSurviveLawfulRestrictions: true,
    remedyMustRemainAvailableForConsequentialDecisions: true,
    arbitraryActionForbidden: true,
    discriminationForbidden: true,
    consequentialAutomationRequiresHumanReviewPath: true,
    restrictionsMustBeNecessaryNarrowDocumentedAndReviewable: true,
  }),

  authority: Object.freeze({
    rolesDoNotOverrideFundamentalRights: true,
    authorityCannotBeDerivedFromPopularity: true,
    authorityCannotBeDerivedFromWealth: true,
    authorityCannotBeDerivedFromFollowerCount: true,
    authorityCannotBeDerivedFromTokenBalance: true,
    consequentialAuthorityRequiresExplicitDelegation: true,
    emergencyAuthorityMustBeNarrowTemporaryAndReviewable: true,
  }),

  authorityBoundary: Object.freeze<ConstitutionalAuthorityBoundary>({
    communityMembershipIsNotLegalCitizenship: true,
    communityGovernanceDoesNotCreateStateAuthority: true,
    platformRemainsCommercialLegalEntity: true,
    corporateLegalDutiesRemainWithAuthorizedLegalActors: true,
    popularityDoesNotCreateAuthority: true,
    wealthDoesNotCreateAuthority: true,
    followerCountDoesNotCreateAuthority: true,
    tokenBalanceDoesNotCreateAuthority: true,
  }),

  amendmentPolicy: Object.freeze<ConstitutionalAmendmentPolicy>({
    versionBumpRequired: true,
    publicChangeRecordRequired: true,
    reasonRequired: true,
    effectiveDateRequired: true,
    rightsImpactReviewRequired: true,
    conflictsOfInterestMustBeDisclosed: true,
    affectedPowerHolderCannotUnilaterallyVeto: true,
    publishedHistoryCannotBeSilentlyRewritten: true,
  }),

  historyPolicy: Object.freeze<ConstitutionalHistoryPolicy>({
    appendOnlyPublishedHistoryRequired: true,
    immutablePublishedVersionIdentifiers: true,
    cryptographicDigestRequiredForSealedVersions: true,
    previousVersionReferenceRequired: true,
    silentHistoryRewriteForbidden: true,
  }),

  transparency: Object.freeze({
    consequentialDecisionsMustBeExplainable: true,
    governanceChangesMustBeAuditable: true,
    sensitiveEvidenceRemainsAccessControlled: true,
    personalDataMustNotBePublishedForTransparency: true,
    securitySensitiveDataMustNotBePublishedForTransparency: true,
  }),

  economicFirewall: Object.freeze({
    moneyCannotPurchaseFundamentalRights: true,
    tokensCannotAutomaticallyGrantGovernanceAuthority: true,
    economicRewardsRemainSeparateFromGovernanceEligibility: true,
  }),

  aiLimits: Object.freeze({
    permanentBanCannotBeSolelyAutonomous: true,
    irreversibleFundsTransferCannotBeSolelyAutonomous: true,
    governanceRightsCannotBeSecretlyAlteredByAI: true,
    reputationCannotBeSecretlyManipulatedByAI: true,
    consequentialAIDecisionsRequireHumanReviewPath: true,
  }),
} as const);

export type LumoraPlatformConstitution =
  typeof LUMORA_PLATFORM_CONSTITUTION;

export function getPlatformConstitution(): LumoraPlatformConstitution {
  return LUMORA_PLATFORM_CONSTITUTION;
}

export function validatePlatformConstitutionBaseline(
  constitution: LumoraPlatformConstitution = LUMORA_PLATFORM_CONSTITUTION,
): boolean {
  const rights = new Set<string>(constitution.fundamentalRights);

  return (
    constitution.id === LUMORA_PLATFORM_CONSTITUTION_ID &&
    constitution.version === LUMORA_PLATFORM_CONSTITUTION_VERSION &&
    constitution.status === "FOUNDATIONAL_BASELINE_ACTIVE" &&
    constitutionLocked === true &&
    rights.has("dignity") &&
    rights.has("equal_treatment") &&
    rights.has("privacy") &&
    rights.has("human_review") &&
    rights.has("remedy_and_appeal") &&
    constitution.amendmentPolicy.versionBumpRequired === true &&
    constitution.amendmentPolicy.publicChangeRecordRequired === true &&
    constitution.amendmentPolicy.affectedPowerHolderCannotUnilaterallyVeto ===
      true &&
    constitution.historyPolicy.appendOnlyPublishedHistoryRequired === true &&
    constitution.historyPolicy.cryptographicDigestRequiredForSealedVersions ===
      true &&
    constitution.authorityBoundary
      .communityMembershipIsNotLegalCitizenship === true &&
    constitution.authorityBoundary
      .communityGovernanceDoesNotCreateStateAuthority === true &&
    constitution.authorityBoundary.platformRemainsCommercialLegalEntity ===
      true &&
    constitution.economicFirewall.moneyCannotPurchaseFundamentalRights ===
      true
  );
}
