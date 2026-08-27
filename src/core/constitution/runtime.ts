import {
  LUMORA_PLATFORM_CONSTITUTION,
  validatePlatformConstitutionBaseline,
} from "@/src/core/governance/constitution";

/**
 * Compatibility export retained for existing callers.
 * This flag now derives from the canonical platform constitution rather than
 * acting as an isolated placeholder.
 */
export const creatorConstitutionEnabled =
  validatePlatformConstitutionBaseline(LUMORA_PLATFORM_CONSTITUTION);

export function getConstitutionRuntimeState() {
  return Object.freeze({
    enabled: creatorConstitutionEnabled,
    constitutionId: LUMORA_PLATFORM_CONSTITUTION.id,
    constitutionVersion: LUMORA_PLATFORM_CONSTITUTION.version,
    status: LUMORA_PLATFORM_CONSTITUTION.status,
    communityMembershipIsNotLegalCitizenship:
      LUMORA_PLATFORM_CONSTITUTION.authorityBoundary
        .communityMembershipIsNotLegalCitizenship,
    platformRemainsCommercialLegalEntity:
      LUMORA_PLATFORM_CONSTITUTION.authorityBoundary
        .platformRemainsCommercialLegalEntity,
    amendmentProcedureRequired:
      LUMORA_PLATFORM_CONSTITUTION.amendmentPolicy.versionBumpRequired,
    appendOnlyHistoryRequired:
      LUMORA_PLATFORM_CONSTITUTION.historyPolicy
        .appendOnlyPublishedHistoryRequired,
  });
}
