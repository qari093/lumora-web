import type { GameState } from "../state/gameState";

export function serializeState(state: GameState) {
  return JSON.stringify(state);
}

export function recoverState(raw: string): GameState {
  return JSON.parse(raw);
}
