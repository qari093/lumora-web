export type SessionState = {
  sessionId: string;
  lane: string;
  continuityScore: number;
  transitions: string[];
};

export function createSessionState(): SessionState {
  return {
    sessionId: crypto.randomUUID(),
    lane: "cosmic-drift",
    continuityScore: 0.92,
    transitions: []
  };
}

export function pushTransition(
  state: SessionState,
  transition: string
): SessionState {
  return {
    ...state,
    transitions: [...state.transitions, transition]
  };
}
