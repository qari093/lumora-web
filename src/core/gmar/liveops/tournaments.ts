export function createTournament(players: number) {
  return {
    valid: players >= 8
  };
}
