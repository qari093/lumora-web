import {
  createGmarDashboardState,
  assertGmarDashboardState
} from "@/src/core/gmar/dashboard-active/dashboardState";

describe("GMAR Post-Activation Pack 01 — Dashboard + Persistence Baseline", () => {
  it("creates playable dashboard state", () => {
    const state = createGmarDashboardState({
      userId: "user_001",
      displayName: "Waqar"
    });

    expect(state.playerId).toBe("gmar_user_001");
    expect(state.displayName).toBe("Waqar");
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.zencoinBalance).toBe(0);
    expect(state.activeMissionTitle).toBe("First Signal");
    expect(state.playable).toBe(true);
    expect(state.readiness).toBe("ready");
    expect(assertGmarDashboardState(state)).toBe(true);
  });
});
