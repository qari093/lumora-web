export function createGmarFypActivityCard(input: any = {}) {
  const state = input.state ?? {};
  const player = state.player ?? {};
  const title = input.title ?? "First Signal Stabilized";
  const type = input.type ?? "event_joined";
  const displayName = player.displayName ?? input.displayName ?? "Waqar";

  return {
    id: `gmar_fyp_${type}`,
    playerId: player.playerId ?? "gmar_user_001",
    type,
    title,
    route: "/gmar",
    description: `${displayName} made progress inside GMAR.`
  };
}

export function createGmarAchievementSurfaceCard(input: any = {}) {
  return createGmarFypActivityCard({ ...input, type: "mission_completed", title: "First Signal Stabilized" });
}

export function assertGmarFypActivityCard(card: any): boolean {
  return Boolean(card?.playerId === "gmar_user_001" && card.route === "/gmar");
}

