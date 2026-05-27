import type {
  AtmosphereConquest,
  ConquestStanding,
  ConquestWinner
} from "./types";

export function crownConquestWinner(input: {
  conquest: AtmosphereConquest;
  standings: ConquestStanding[];
}): ConquestWinner {
  const winner = input.standings.find(
    entry => entry.rank === 1
  );

  if (!winner) {
    throw new Error("No conquest winner found.");
  }

  return {
    creatorId: winner.creatorId,
    conquestId: input.conquest.conquestId,
    crowned: true,
    rewardTitle: `${input.conquest.mode} Sovereign`
  };
}
