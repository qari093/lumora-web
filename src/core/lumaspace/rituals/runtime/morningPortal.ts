export function createMorningPortal() {
  return {
    id: "portal_001",
    arrival: "echo_seed"
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
