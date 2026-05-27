import {
  getAvailableGmarMissions,
  calculateGmarLevelFromXp
} from "@/src/core/gmar/final-completion/gameplay/content";

export type GmarDashboardUiState = {
  playerPanelReady: true;
  missionPanelReady: true;
  inventoryPanelReady: true;
  walletPanelReady: true;
  eventPanelReady: true;
  squadPanelReady: true;
  creatorPanelReady: true;
  leaderboardPanelReady: true;
  mobileReady: true;
  desktopReady: true;
  loadingStateReady: true;
  emptyStateReady: true;
  errorStateReady: true;
  availableMissionCount: number;
  calculatedLevel: number;
};

export function createGmarDashboardUiState(input: {
  xp: number;
}): GmarDashboardUiState {
  const calculatedLevel = calculateGmarLevelFromXp(input.xp);
  const availableMissions = getAvailableGmarMissions(calculatedLevel);

  return {
    playerPanelReady: true,
    missionPanelReady: true,
    inventoryPanelReady: true,
    walletPanelReady: true,
    eventPanelReady: true,
    squadPanelReady: true,
    creatorPanelReady: true,
    leaderboardPanelReady: true,
    mobileReady: true,
    desktopReady: true,
    loadingStateReady: true,
    emptyStateReady: true,
    errorStateReady: true,
    availableMissionCount: availableMissions.length,
    calculatedLevel
  };
}

export function assertGmarDashboardUiState(
  state: GmarDashboardUiState
): true {
  const coreReady =
    state.playerPanelReady &&
    state.missionPanelReady &&
    state.inventoryPanelReady &&
    state.walletPanelReady &&
    state.eventPanelReady &&
    state.squadPanelReady &&
    state.creatorPanelReady &&
    state.leaderboardPanelReady &&
    state.mobileReady &&
    state.desktopReady &&
    state.loadingStateReady &&
    state.emptyStateReady &&
    state.errorStateReady;

  if (
    coreReady !== true ||
    state.availableMissionCount < 1 ||
    state.calculatedLevel < 1
  ) {
    throw new Error("Invalid GMAR dashboard UI state.");
  }

  return true;
}
