export type MatchTicket = {
  playerId: string;
  rank: number;
};

export function matchPlayers(tickets: MatchTicket[]) {
  return tickets.sort((a, b) => a.rank - b.rank);
}
