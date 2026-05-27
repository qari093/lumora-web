import type {
  ConquestStanding
} from "./types";

export function rankConquestStandings(
  standings: Omit<ConquestStanding, "rank">[]
): ConquestStanding[] {
  return standings
    .sort((a, b) => {
      const scoreA =
        a.impactQuotient + a.resonance + a.voltage;

      const scoreB =
        b.impactQuotient + b.resonance + b.voltage;

      return scoreB - scoreA;
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
}
