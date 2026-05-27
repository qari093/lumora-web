import type { RuntimeWitnessPresence } from "./runtimePresence";

export type RuntimeWitnessTrace = RuntimeWitnessPresence & {
  traceId: string;
  stored: true;
};

export function storeRuntimeWitnessTrace(presence: RuntimeWitnessPresence): RuntimeWitnessTrace {
  return {
    ...presence,
    traceId: `${presence.circleId}:${presence.creatorId}:${presence.witnessId}`,
    stored: true,
  };
}

export function storeRuntimeWitnessTraces(presences: RuntimeWitnessPresence[]): RuntimeWitnessTrace[] {
  return presences.map(storeRuntimeWitnessTrace);
}
