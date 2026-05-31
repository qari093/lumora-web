import { describe, expect, it } from "vitest";
import { createPulseSignal, isSignalActive } from "@/src/core/lumaspace/omega/pulse/signalEngine";
import { applySignalDiversity, rankPulseSignals, scorePulseSignal } from "@/src/core/lumaspace/omega/pulse/rankingEngine";
import { completePulseCycle, createPulseCycle, createPulseReflection } from "@/src/core/lumaspace/omega/pulse/pulseCycle";
import { injectBridgeSignal, injectMissionSignal, injectWisdomSignal } from "@/src/core/lumaspace/omega/pulse/injectionEngine";
import { performPulseAction } from "@/src/core/lumaspace/omega/pulse/pulseActions";
import { runLumaSpaceOmegaMegaPack05Runtime } from "@/src/core/lumaspace/omega/pulse/omegaPack05Runtime";

describe("LumaSpace Ω∞ Mega Pack 05 — Signals + Pulse Civilization Feed", () => {
  it("creates active pulse signal", () => {
    const signal = createPulseSignal({
      id: "s1",
      kind: "wisdom_beacon",
      creatorId: "u1",
      title: "Wisdom",
      emotionalWeight: 90,
      trustScore: 95,
      freshness: 70,
      diversityKey: "wisdom",
    });

    expect(signal.actions).toContain("resonate");
    expect(isSignalActive(signal)).toBe(true);
  });

  it("scores and ranks signals", () => {
    const low = createPulseSignal({
      id: "low",
      kind: "celebration",
      creatorId: "u1",
      title: "Low",
      emotionalWeight: 10,
      trustScore: 20,
      freshness: 30,
      diversityKey: "a",
    });

    const high = createPulseSignal({
      id: "high",
      kind: "mission_recap",
      creatorId: "u2",
      title: "High",
      emotionalWeight: 90,
      trustScore: 90,
      freshness: 90,
      diversityKey: "b",
    });

    expect(scorePulseSignal(high)).toBeGreaterThan(scorePulseSignal(low));
    expect(rankPulseSignals([low, high])[0].id).toBe("high");
  });

  it("applies diversity caps", () => {
    const signals = ["a", "b", "c"].map((id) =>
      createPulseSignal({
        id,
        kind: "celebration",
        creatorId: id,
        title: id,
        emotionalWeight: 50,
        trustScore: 50,
        freshness: 50,
        diversityKey: "same",
      }),
    );

    expect(applySignalDiversity(signals, 2)).toHaveLength(2);
  });

  it("creates and completes pulse cycle", () => {
    const signal = createPulseSignal({
      id: "s2",
      kind: "living_card_update",
      creatorId: "u1",
      title: "Update",
      emotionalWeight: 70,
      trustScore: 70,
      freshness: 70,
      diversityKey: "identity",
    });

    const cycle = completePulseCycle(createPulseCycle({
      citizenId: "c1",
      signals: [signal],
    }));

    const reflection = createPulseReflection(cycle);

    expect(cycle.completed).toBe(true);
    expect(reflection.prompt).toContain("what your world created");
  });

  it("injects wisdom, mission, and bridge signals", () => {
    let signals = [];
    signals = injectWisdomSignal(signals, "c1");
    signals = injectMissionSignal(signals, "community1");
    signals = injectBridgeSignal(signals, "c1");

    expect(signals).toHaveLength(3);
    expect(signals.map((signal) => signal.kind)).toContain("bridge_invitation");
  });

  it("performs pulse actions", () => {
    const signal = createPulseSignal({
      id: "s3",
      kind: "mission_recap",
      creatorId: "community1",
      title: "Mission",
      emotionalWeight: 90,
      trustScore: 90,
      freshness: 90,
      diversityKey: "mission",
    });

    expect(performPulseAction(signal, "join_mission").accepted).toBe(true);
    expect(performPulseAction(signal, "open_bridge").accepted).toBe(false);
  });

  it("runs full mega pack runtime", () => {
    const runtime = runLumaSpaceOmegaMegaPack05Runtime();

    expect(runtime.ok).toBe(true);
    expect(runtime.ranked.length).toBeGreaterThanOrEqual(5);
    expect(runtime.cycle.completed).toBe(true);
    expect(runtime.action.accepted).toBe(true);
  });
});
