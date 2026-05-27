import { arrivalDurationSeconds, normalizeArrivalMode, type ArrivalMode } from "./arrivalMode";
import { createEmotionalContract, emotionalContractHealthy } from "./emotionalContract";
import { completeResonanceCompass, type ResonanceCluster } from "./resonanceCompass";
import { createFirstLightEcho } from "../memory/firstLight";
import { createInitialMemoryThread } from "../memory/thread";

export type FirstEchoRiteResult = {
  mode: ArrivalMode;
  durationSeconds: number;
  contractSigned: boolean;
  resonanceCluster: ResonanceCluster;
  firstEchoTitle: "First Light";
  memoryThreadCount: number;
};

export function runFirstEchoRite(input?: {
  mode?: string;
  resonanceCluster?: ResonanceCluster;
}): FirstEchoRiteResult {
  const mode = normalizeArrivalMode(input?.mode);
  const contract = createEmotionalContract();
  const compass = completeResonanceCompass(input?.resonanceCluster ?? "calm");
  const firstEcho = createFirstLightEcho();
  const thread = createInitialMemoryThread();

  return {
    mode,
    durationSeconds: arrivalDurationSeconds(mode),
    contractSigned: emotionalContractHealthy(contract),
    resonanceCluster: compass.cluster,
    firstEchoTitle: firstEcho.title,
    memoryThreadCount: thread.length,
  };
}
