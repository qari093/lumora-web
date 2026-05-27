import {
  createGmarDashboardUiState,
  assertGmarDashboardUiState
} from "@/src/core/gmar/final-completion/dashboard/dashboardUiState";

describe("GMAR Final Completion Phase 04 — Real GMAR Dashboard UI", () => {
  it("creates complete dashboard UI state", () => {
    const state = createGmarDashboardUiState({
      xp: 250
    });

    expect(state.playerPanelReady).toBe(true);
    expect(state.missionPanelReady).toBe(true);
    expect(state.inventoryPanelReady).toBe(true);
    expect(state.walletPanelReady).toBe(true);
    expect(state.eventPanelReady).toBe(true);
    expect(state.squadPanelReady).toBe(true);
    expect(state.creatorPanelReady).toBe(true);
    expect(state.leaderboardPanelReady).toBe(true);
    expect(state.mobileReady).toBe(true);
    expect(state.desktopReady).toBe(true);
    expect(state.loadingStateReady).toBe(true);
    expect(state.emptyStateReady).toBe(true);
    expect(state.errorStateReady).toBe(true);
    expect(state.calculatedLevel).toBe(3);
    expect(state.availableMissionCount).toBeGreaterThanOrEqual(3);
    expect(assertGmarDashboardUiState(state)).toBe(true);
  });
});
