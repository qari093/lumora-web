import type {
  ConductorPersona,
  ConductorState
} from "./types";

export function createConductorState(input: {
  userId: string;
  persona?: ConductorPersona;
  adaptationLevel?: number;
  trustScore?: number;
}): ConductorState {
  if (!input.userId.trim()) {
    throw new Error("Conductor requires userId.");
  }

  return {
    userId: input.userId,
    persona: input.persona ?? "poetic",
    enabled: true,
    adaptationLevel: input.adaptationLevel ?? 1,
    trustScore: input.trustScore ?? 50
  };
}

export function evolveConductorState(
  state: ConductorState
): ConductorState {
  return {
    ...state,
    adaptationLevel: Math.min(100, state.adaptationLevel + 5),
    trustScore: Math.min(100, state.trustScore + 3)
  };
}
