import type {
  EchoSeed
} from "../types";

import {
  validateEchoSeed
} from "../contracts/ritualContract";

export function createEchoSeed(
  atmosphere = "calm"
): EchoSeed {
  const seed: EchoSeed = {
    id: `echo_seed_${atmosphere}`,
    prompt: "Capture one gentle fragment of now.",
    atmosphere,
    optional: true
  };

  if (!validateEchoSeed(seed)) {
    throw new Error("invalid_echo_seed");
  }

  return seed;
}

export {
  createDailyArrival,
  openMorningPortal,
  runDailyRitualRuntime,
  validateDailyArrival
} from "@/core/lumaspace/compat/legacyContracts";
