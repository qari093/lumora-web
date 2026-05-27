import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { createAtRestDashboardState } from "@/src/lib/creator-system/dashboard-at-rest/atRestState";
import { buildCreatorIdentityHeader } from "@/src/lib/creator-system/dashboard-at-rest/identityHeader";
import { buildWitnessedAnchor } from "@/src/lib/creator-system/dashboard-at-rest/witnessedAnchor";
import { buildNextCircleCountdown } from "@/src/lib/creator-system/dashboard-at-rest/nextCircleCountdown";
import { getCalmDashboardBackground } from "@/src/lib/creator-system/dashboard-at-rest/calmBackground";

describe("Pack13 Dashboard At Rest", () => {
  it("builds at-rest dashboard state", () => {
    const state = createAtRestDashboardState({ creatorId: "c1" });
    expect(state.state).toBe("at-rest");
    expect(state.calmMode).toBe(true);
  });

  it("builds identity header without vanity metrics", () => {
    const header = buildCreatorIdentityHeader({ creatorId: "c1", displayName: "Mira" });
    expect(header.displayName).toBe("Mira");
    expect(header.vanityMetricsHidden).toBe(true);
  });

  it("builds witnessed anchor without interpretation text", () => {
    const anchor = buildWitnessedAnchor("2026-05-02T19:00:00.000Z");
    expect(anchor.text).toBe("You were witnessed");
    expect(anchor.interpretationText).toBe(false);
  });

  it("builds next circle countdown", () => {
    const countdown = buildNextCircleCountdown({
      nextCircleIso: "2026-05-02T19:10:00.000Z",
      nowIso: "2026-05-02T19:00:00.000Z",
    });

    expect(countdown.available).toBe(true);
    expect(countdown.secondsRemaining).toBe(600);
  });

  it("creates calm dashboard background and page", () => {
    const bg = getCalmDashboardBackground();
    expect(bg.theme).toBe("calm");
    expect(bg.contrastSafe).toBe(true);
    expect(fs.existsSync("app/creator/dashboard/page.tsx")).toBe(true);
  });
});
