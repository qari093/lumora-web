export function matchmaking(rankA: number, rankB: number) {
  return Math.abs(rankA - rankB) <= 3;
}
