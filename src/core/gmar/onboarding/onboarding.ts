import {
  createInitialGmarGameState,
  type GmarGameState
} from "@/src/core/gmar/state/gameState";

export type GmarOnboardingStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type GmarOnboardingSession = {
  sessionId: string;
  state: GmarGameState;
  steps: GmarOnboardingStep[];
  activeStepId: string;
  firstRewardReady: boolean;
  returnIntentPromptReady: boolean;
  createdAt: string;
};

export function createGmarOnboardingSession(input: {
  userId: string;
  displayName?: string;
  now?: Date;
}): GmarOnboardingSession {
  const now = input.now ?? new Date();
  const iso = now.toISOString();

  const state = createInitialGmarGameState({
    userId: input.userId,
    displayName: input.displayName,
    now
  });

  const steps: GmarOnboardingStep[] = [
    {
      id: "enter_gmar",
      title: "Enter GMAR",
      description: "Arrive at the GMAR origin gate.",
      completed: true
    },
    {
      id: "stabilize_signal",
      title: "Stabilize First Signal",
      description: "Complete your first playable objective.",
      completed: false
    },
    {
      id: "claim_first_reward",
      title: "Claim First Reward",
      description: "Receive XP and starter Zencoin reward.",
      completed: false
    }
  ];

  return {
    sessionId: `gmar_onboarding_${state.player.userId}`,
    state,
    steps,
    activeStepId: "stabilize_signal",
    firstRewardReady: true,
    returnIntentPromptReady: true,
    createdAt: iso
  };
}

export function assertGmarOnboardingSession(session: GmarOnboardingSession): true {
  if (
    !session.sessionId ||
    session.steps.length < 3 ||
    session.activeStepId !== "stabilize_signal" ||
    session.firstRewardReady !== true ||
    session.returnIntentPromptReady !== true
  ) {
    throw new Error("Invalid GMAR onboarding session.");
  }

  return true;
}
