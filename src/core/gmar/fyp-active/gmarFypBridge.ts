import type { GmarGameState } from "@/src/core/gmar/state/gameState";

export type GmarFypActivityType =
  | "mission_completed"
  | "event_joined"
  | "reward_claimed"
  | "squad_joined";

export type GmarFypActivityCard = {
  id: string;
  type: GmarFypActivityType;
  playerId: string;
  title: string;
  description: string;
  route: "/gmar";
  shareable: boolean;
  createdAt: string;
};

export function createGmarFypActivityCard(input: {
  state: GmarGameState;
  type: GmarFypActivityType;
  title: string;
  description: string;
  now?: Date;
}): GmarFypActivityCard {
  const title = input.title.trim();
  const description = input.description.trim();

  if (!title || !description) {
    throw new Error("GMAR FYP activity title and description are required.");
  }

  const now = input.now ?? new Date();

  return {
    id: `gmar_fyp_${input.type}_${input.state.player.playerId}_${now.getTime()}`,
    type: input.type,
    playerId: input.state.player.playerId,
    title,
    description,
    route: "/gmar",
    shareable: true,
    createdAt: now.toISOString()
  };
}

export function createGmarAchievementSurface(input: {
  state: GmarGameState;
  achievementTitle: string;
  now?: Date;
}): GmarFypActivityCard {
  return createGmarFypActivityCard({
    state: input.state,
    type: "mission_completed",
    title: input.achievementTitle,
    description: `${input.state.player.displayName} made progress inside GMAR.`,
    now: input.now
  });
}

export function assertGmarFypActivityCard(card: GmarFypActivityCard): true {
  if (
    !card.id ||
    !card.playerId ||
    card.route !== "/gmar" ||
    card.shareable !== true ||
    !card.title ||
    !card.description
  ) {
    throw new Error("Invalid GMAR FYP activity card.");
  }

  return true;
}
