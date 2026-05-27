export function createMatch(players: number) {
  return {
    ready: players >= 2
  };
}
