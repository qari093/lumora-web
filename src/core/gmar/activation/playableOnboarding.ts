import { createInitialGmarGameState } from "../state/gameState";

export function createPlayableOnboardingSession(input: { userId?: string; displayName?: string } = { userId: "user_001", displayName: "Waqar" }) {
  const state = createInitialGmarGameState(input);
  return {
    sessionId: `gmar_onboarding_${state.player.userId}`,
    state,
    steps: [
      { id: "identity", completed: true },
      { id: "movement", completed: true },
      { id: "first_signal", completed: false }
    ]
  };
}

export function assertPlayableOnboardingSession(session: any): boolean {
  return Boolean(session?.sessionId && session?.state?.player?.playerId === "gmar_user_001" && session?.steps?.length === 3);
}

