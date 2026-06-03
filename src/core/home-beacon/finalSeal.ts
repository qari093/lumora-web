import { getHomeBeaconBetaActivation } from "./betaActivation";
import { getLumenCoreEvolutionHooks } from "./lumenEvolution";

export function createHomeBeaconFinalSeal() {
  const beta = getHomeBeaconBetaActivation();
  const evolution = getLumenCoreEvolutionHooks();

  return {
    system: "Lumora Home Beacon Ω∞",
    status: "HOME_BEACON_SEALED",
    betaReady: beta.privateBetaReady,
    homeBeaconActive: beta.homeBeaconEnabled,
    portalArcActive: beta.portalArcEnabled,
    gravityBridgeActive: beta.gravityBridgeEnabled,
    interactionBridgeActive: beta.interactionBridgeEnabled,
    lumenCoreEvolutionPrepared: true,
    lumenCoreActiveNow: evolution.activeNow,
  };
}
