import { createValidationMediaPool } from "../store";
import {
  createFypLumaSpaceValidationJourney,
  summarizeFypLumaSpaceValidationJourneys,
} from "./journey";

export function runValidationPoolBridge() {
  const assets = createValidationMediaPool();
  const journeys = assets.map((asset) => createFypLumaSpaceValidationJourney(asset));
  const summary = summarizeFypLumaSpaceValidationJourneys(journeys);

  return {
    poolSize: assets.length,
    journeys,
    summary,
  };
}

export function createValidationPoolBridgeCertification() {
  const bridge = runValidationPoolBridge();

  return {
    id: "validation_pool_bridge_certification_v1",
    ready: bridge.summary.ready && bridge.poolSize === 40,
    poolSize: bridge.poolSize,
    passed: bridge.summary.passed,
    failed: bridge.summary.failed,
    requiredSurfaces: ["fyp", "voice_check", "lumaspace", "universal_share"],
  };
}
