import { describe, expect, it } from "vitest";
import { antiCheatAbuseHealthy } from "../../../src/core/gmar/anti-cheat/runtime";
import { scoreAbuseRisk } from "../../../src/core/gmar/anti-cheat/scoring";
import { decideAbuseAction } from "../../../src/core/gmar/anti-cheat/enforcement";

describe("GMAR Pack 34/40 — Anti-Cheat + Abuse Runtime", () => {
  it("validates anti-cheat runtime", () => {
    const runtime = antiCheatAbuseHealthy();
    expect(runtime.cheatSignalsTracked).toBe(true);
    expect(runtime.falsePositiveGuarded).toBe(true);
    expect(runtime.appealReady).toBe(true);
  });

  it("scores abuse risk deterministically", () => {
    expect(scoreAbuseRisk({})).toBe(0);
    expect(scoreAbuseRisk({ impossibleScoreDelta: true, eventSpamRate: 140 })).toBe(80);
  });

  it("uses staged enforcement", () => {
    expect(decideAbuseAction(10)).toBe("allow");
    expect(decideAbuseAction(50)).toBe("shadow_review");
    expect(decideAbuseAction(90)).toBe("temporary_lock");
  });
});
