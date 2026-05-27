import { countRepeatPresence, type WitnessPresenceTrace } from "./repeatPresence";

export type PrivateWitnessConstellationNode = {
  witnessId: string;
  witnessName: string;
  repeatPresenceCount: number;
  privateOnly: true;
  profileLinkingAllowed: false;
};

export function buildPrivateWitnessConstellation(input: {
  creatorId: string;
  witnesses: { witnessId: string; witnessName: string }[];
  traces: WitnessPresenceTrace[];
}): PrivateWitnessConstellationNode[] {
  return input.witnesses.map((witness) => ({
    witnessId: witness.witnessId,
    witnessName: witness.witnessName,
    repeatPresenceCount: countRepeatPresence({
      creatorId: input.creatorId,
      witnessId: witness.witnessId,
      traces: input.traces,
    }),
    privateOnly: true,
    profileLinkingAllowed: false,
  }));
}
