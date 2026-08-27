import {
  LUMORA_PLATFORM_CONSTITUTION,
  validatePlatformConstitutionBaseline,
} from "@/src/core/governance/constitution";

/**
 * "Civilization" is a product/community architecture term.
 * It does not assert statehood, sovereignty, nationality, or legal citizenship.
 */
export const civilizationRuntimeEnabled =
  validatePlatformConstitutionBaseline(LUMORA_PLATFORM_CONSTITUTION);

export function getCivilizationRuntimeState() {
  return Object.freeze({
    enabled: civilizationRuntimeEnabled,
    communityModel: "digital_community" as const,
    legalStatus: "platform_service_company_ecosystem" as const,
    legalCitizenshipCreated: false,
    statehoodClaimed: false,
    sovereigntyClaimed: false,
    constitutionId: LUMORA_PLATFORM_CONSTITUTION.id,
    constitutionVersion: LUMORA_PLATFORM_CONSTITUTION.version,
  });
}
