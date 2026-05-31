import type { LumaSpaceRole } from "./civilizationCore";

export type CitizenLifecycleStage =
  | "first_light"
  | "new_citizen"
  | "active_citizen"
  | "steward_candidate"
  | "steward"
  | "guardian_candidate"
  | "guardian"
  | "council_member";

export type CitizenLifecycleState = {
  citizenId: string;
  role: LumaSpaceRole;
  stage: CitizenLifecycleStage;
  completedFirstLight: boolean;
  completedFirstContribution: boolean;
  completedFirstBridgeTutorial: boolean;
  trustSignals: number;
  contributionSignals: number;
};

export function createCitizenLifecycle(citizenId: string): CitizenLifecycleState {
  if (!citizenId.trim()) throw new Error("citizenId_required");

  return {
    citizenId,
    role: "citizen",
    stage: "first_light",
    completedFirstLight: false,
    completedFirstContribution: false,
    completedFirstBridgeTutorial: false,
    trustSignals: 0,
    contributionSignals: 0,
  };
}

export function advanceCitizenLifecycle(state: CitizenLifecycleState): CitizenLifecycleState {
  if (!state.completedFirstLight) return { ...state, stage: "first_light", role: "citizen" };
  if (!state.completedFirstContribution) return { ...state, stage: "new_citizen", role: "citizen" };
  if (state.contributionSignals >= 25 && state.trustSignals >= 15) {
    return { ...state, stage: "steward_candidate", role: "citizen" };
  }
  return { ...state, stage: "active_citizen", role: "citizen" };
}
