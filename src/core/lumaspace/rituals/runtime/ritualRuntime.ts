export function runRitualRuntime() {
  return {
    active: true,
    portalId: "portal_001"
  };
}

export {
  createDailyArrival,
  createEchoSeed,
  openMorningPortal,
  runDailyRitualRuntime,
  validateDailyArrival,
  validateEchoSeed
} from "@/core/lumaspace/compat/legacyContracts";
