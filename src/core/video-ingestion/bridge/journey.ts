import type { CanonicalVideoAsset } from "../runtime";
import type { FypLumaSpaceValidationJourney, ValidationBridgeSummary } from "./types";
import {
  validateFypPlayback,
  validateLumaSpaceMemorySave,
  validateUniversalShareReadiness,
  validateVoiceCheck,
} from "./steps";

export function createFypLumaSpaceValidationJourney(
  asset: CanonicalVideoAsset,
): FypLumaSpaceValidationJourney {
  const steps = [
    validateFypPlayback(asset),
    validateVoiceCheck(asset),
    validateLumaSpaceMemorySave(asset),
    validateUniversalShareReadiness(asset),
  ];

  return {
    id: `fyp_lumaspace_validation_${asset.id}`,
    assetId: asset.id,
    providerId: asset.providerId,
    asset,
    steps,
    passed: steps.every((step) => step.passed),
  };
}

export function summarizeFypLumaSpaceValidationJourneys(
  journeys: FypLumaSpaceValidationJourney[],
): ValidationBridgeSummary {
  const passed = journeys.filter((journey) => journey.passed).length;

  return {
    total: journeys.length,
    passed,
    failed: journeys.length - passed,
    ready: journeys.length > 0 && passed === journeys.length,
  };
}
