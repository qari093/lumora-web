import type {
  VoltCrown,
  VoltRivalry
} from "./types";

export function crownVoltWinner(input: {
  rivalry: VoltRivalry;
  winnerId: string;
}): VoltCrown {
  return {
    creatorId: input.winnerId,
    mode: input.rivalry.mode,
    durationHours: 72,
    title: "Volt Crown"
  };
}
