export type PlayerState = {
  activeId: string | null;
  isMuted: boolean;
};

export function createInitialPlayerState(): PlayerState {
  return {
    activeId: null,
    isMuted: true,
  };
}

export function activateVideo(state: PlayerState, id: string): PlayerState {
  return {
    ...state,
    activeId: id,
  };
}

export function toggleMute(state: PlayerState): PlayerState {
  return {
    ...state,
    isMuted: !state.isMuted,
  };
}
