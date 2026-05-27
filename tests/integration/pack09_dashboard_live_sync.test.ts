import { describe, expect, it } from "vitest";
import { connectDashboardToRuntimeState } from "@/src/lib/integration/dashboard-live-sync/runtimeState";
import { syncNextCircleCountdown } from "@/src/lib/integration/dashboard-live-sync/countdownSync";
import { injectWitnessedAnchor } from "@/src/lib/integration/dashboard-live-sync/witnessedAnchorSync";
import { updateIdentityHeaderLive } from "@/src/lib/integration/dashboard-live-sync/identityHeaderLive";
import { validateDashboardLiveRefresh } from "@/src/lib/integration/dashboard-live-sync/validateDashboardRefresh";

describe("Integration Pack09 — Dashboard Live Sync", () => {
  it("connects dashboard to runtime state", () => {
    const runtimeState = connectDashboardToRuntimeState({
      creatorId: "c1",
      state: "after-witness",
      updatedAt: "2026-05-02T19:00:00.000Z",
    });

    expect(runtimeState.connected).toBe(true);
    expect(runtimeState.state).toBe("after-witness");
  });

  it("syncs next circle countdown", () => {
    const countdown = syncNextCircleCountdown({
      nextCircleIso: "2026-05-02T19:10:00.000Z",
      nowIso: "2026-05-02T19:00:00.000Z",
    });

    expect(countdown.visible).toBe(true);
    expect(countdown.secondsRemaining).toBe(600);
  });

  it("injects witnessed anchor", () => {
    const dashboard = injectWitnessedAnchor({}, { lastWitnessedAt: "2026-05-02T19:00:00.000Z" });

    expect(dashboard.witnessedAnchor.visible).toBe(true);
    expect(dashboard.witnessedAnchor.text).toBe("You were witnessed");
    expect(dashboard.witnessedAnchor.interpretationText).toBe(false);
  });

  it("updates identity header live", () => {
    const dashboard = updateIdentityHeaderLive({}, {
      creatorId: "c1",
      displayName: "Mira",
      presenceState: "after-witness",
    });

    expect(dashboard.identityHeader.displayName).toBe("Mira");
    expect(dashboard.identityHeader.vanityMetricsHidden).toBe(true);
  });

  it("validates dashboard refresh", () => {
    let dashboard: any = {};
    dashboard.runtimeState = connectDashboardToRuntimeState({ creatorId: "c1", state: "after-witness" });
    dashboard.nextCircleCountdown = syncNextCircleCountdown({ nextCircleIso: "2026-05-02T19:10:00.000Z", nowIso: "2026-05-02T19:00:00.000Z" });
    dashboard = injectWitnessedAnchor(dashboard, {});
    dashboard = updateIdentityHeaderLive(dashboard, { creatorId: "c1", displayName: "Mira", presenceState: "after-witness" });

    expect(validateDashboardLiveRefresh(dashboard).ok).toBe(true);
    expect(validateDashboardLiveRefresh({}).ok).toBe(false);
  });
});
