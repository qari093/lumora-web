export type FirstBridgeTutorialState = {
  citizenId: string;
  day: 1 | 2 | 3;
  serendipityGateVisible: boolean;
  prompt: string;
  targetType: "ambassador" | "new_citizen" | "guardian";
  starlightPulseSent: boolean;
  completed: boolean;
};

export function createFirstBridgeTutorial(citizenId: string, day: 1 | 2 | 3 = 2): FirstBridgeTutorialState {
  if (!citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId,
    day,
    serendipityGateVisible: day >= 2,
    prompt: "Someone out there shares your light. Open your first gate?",
    targetType: "ambassador",
    starlightPulseSent: false,
    completed: false,
  };
}

export function sendTutorialStarlightPulse(state: FirstBridgeTutorialState): FirstBridgeTutorialState {
  if (!state.serendipityGateVisible) throw new Error("serendipity_gate_not_visible");

  return {
    ...state,
    starlightPulseSent: true,
    completed: true,
  };
}
