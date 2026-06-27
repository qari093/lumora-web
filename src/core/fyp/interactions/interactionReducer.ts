import type {
  FypInteractionEvent,
  FypInteractionState
} from "./interactionTypes";

export const EMPTY_FYP_INTERACTION_STATE: FypInteractionState = {
  likes: 0,
  dislikes: 0,
  shares: 0,
  saves: 0,
  sendsToSpace: 0,
  deepDives: 0
};

export function reduceFypInteraction(
  state: FypInteractionState,
  event: FypInteractionEvent
): FypInteractionState {
  if (!event.assetId || !event.lane || event.ts <= 0) {
    return state;
  }

  if (event.type === "like") {
    return { ...state, likes: state.likes + 1 };
  }

  if (event.type === "dislike") {
    return { ...state, dislikes: state.dislikes + 1 };
  }

  if (event.type === "share") {
    return { ...state, shares: state.shares + 1 };
  }

  if (event.type === "save") {
    return { ...state, saves: state.saves + 1 };
  }

  if (event.type === "send_to_space") {
    return { ...state, sendsToSpace: state.sendsToSpace + 1 };
  }

  if (event.type === "deep_dive") {
    return { ...state, deepDives: state.deepDives + 1 };
  }

  return state;
}
