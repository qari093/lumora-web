import type {
  EchoSeed,
  MorningPortal,
  RitualRuntime
} from "../types";

export function validateEchoSeed(
  seed: EchoSeed
): boolean {
  return Boolean(
    seed.id &&
    seed.mood
  );
}

export function validateMorningPortal(
  portal: MorningPortal
): boolean {
  return Boolean(
    portal.id &&
    portal.arrival
  );
}

export function validateRitualRuntime(
  runtime: RitualRuntime
): boolean {
  return Boolean(
    runtime.active === true &&
    runtime.portalId
  );
}

export {
  createDailyArrival,
  createEchoSeed,
  openMorningPortal,
  runDailyRitualRuntime,
  validateDailyArrival
} from "@/core/lumaspace/compat/legacyContracts";
