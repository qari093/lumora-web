import type { EchoCandidate, EchoType } from "./types";

export type EchoArtifact = {
  id: string;
  type: EchoType;
  title: string;
  permanent: boolean;
  publicInitially: boolean;
  powerReward: false;
};

export function createEchoArtifact(
  id: string,
  candidate: EchoCandidate,
): EchoArtifact {
  return {
    id,
    type: candidate.type,
    title: candidate.type === "sync" ? "Sync Echo" : "Memory Echo",
    permanent: candidate.type !== "vanishing",
    publicInitially: candidate.eligible,
    powerReward: false,
  };
}
