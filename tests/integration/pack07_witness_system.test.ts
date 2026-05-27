import { describe, expect, it } from "vitest";
import { captureRuntimeWitnessPresence } from "@/src/lib/integration/witness-system/runtimePresence";
import { syncWitnessSilhouettesInFyp } from "@/src/lib/integration/witness-system/fypSilhouettes";
import { storeRuntimeWitnessTrace, storeRuntimeWitnessTraces } from "@/src/lib/integration/witness-system/witnessTraceStore";
import { attachWitnessToCreator } from "@/src/lib/integration/witness-system/attachWitnessCreator";
import { validateWitnessContinuity } from "@/src/lib/integration/witness-system/validateContinuity";

describe("Integration Pack07 — Witness System Integration", () => {
  it("captures witness presence in runtime", () => {
    const presence = captureRuntimeWitnessPresence({
      circleId: "circle1",
      creatorId: "c1",
      witnessId: "w1",
      witnessName: "Nova",
    });

    expect(presence.present).toBe(true);
    expect(presence.witnessName).toBe("Nova");
  });

  it("syncs silhouettes in FYP", () => {
    const presence = captureRuntimeWitnessPresence({
      circleId: "circle1",
      creatorId: "c1",
      witnessId: "w1",
      witnessName: "Nova",
    });

    const silhouettes = syncWitnessSilhouettesInFyp([presence]);

    expect(silhouettes).toHaveLength(1);
    expect(silhouettes[0].anonymous).toBe(true);
    expect(silhouettes[0].profileHidden).toBe(true);
  });

  it("stores witness traces", () => {
    const presence = captureRuntimeWitnessPresence({
      circleId: "circle1",
      creatorId: "c1",
      witnessId: "w1",
      witnessName: "Nova",
    });

    const trace = storeRuntimeWitnessTrace(presence);
    const traces = storeRuntimeWitnessTraces([presence]);

    expect(trace.stored).toBe(true);
    expect(trace.traceId).toBe("circle1:c1:w1");
    expect(traces).toHaveLength(1);
  });

  it("attaches witness to creator without profile linking", () => {
    const attached = attachWitnessToCreator({
      creatorId: "c1",
      witnessId: "w1",
      circleId: "circle1",
    });

    expect(attached.attached).toBe(true);
    expect(attached.profileLinkingAllowed).toBe(false);
  });

  it("validates witness continuity", () => {
    const trace = storeRuntimeWitnessTrace(
      captureRuntimeWitnessPresence({
        circleId: "circle1",
        creatorId: "c1",
        witnessId: "w1",
        witnessName: "Nova",
      }),
    );

    expect(validateWitnessContinuity({
      traces: [trace],
      creatorId: "c1",
      witnessId: "w1",
    }).ok).toBe(true);

    expect(validateWitnessContinuity({
      traces: [trace],
      creatorId: "c1",
      witnessId: "w2",
    }).ok).toBe(false);
  });
});
