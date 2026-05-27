import type { LiveAlchemyMode, LiveAlchemyRoom } from "./types";

export function createLiveAlchemyRoom(input: {
  id: string;
  constellation: string;
  mode: LiveAlchemyMode;
  hostCreatorId: string;
  activeViewers?: number;
}): LiveAlchemyRoom {
  const quietMode = input.mode === "dream_chamber" || input.mode === "shadow_circle" || input.mode === "silent_audience";

  return {
    id: input.id,
    constellation: input.constellation,
    mode: input.mode,
    hostCreatorId: input.hostCreatorId,
    activeViewers: input.activeViewers ?? 0,
    likesHidden: quietMode,
    commentsHidden: input.mode === "dream_chamber" || input.mode === "shadow_circle",
    quietGiftsEnabled: true,
    moderationEnabled: true
  };
}
