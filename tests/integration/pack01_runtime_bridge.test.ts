import { describe, it, expect } from "vitest";
import { connectCreatorToFypRuntime } from "@/src/lib/integration/runtime-bridge/connectCreatorToFyp";
import { injectCreatorIdentity } from "@/src/lib/integration/runtime-bridge/injectCreatorIdentity";
import { mapHumanSignalsToFyp } from "@/src/lib/integration/runtime-bridge/mapSignals";
import { attachCircleState } from "@/src/lib/integration/runtime-bridge/attachCircleState";
import { validateRuntimeBridge } from "@/src/lib/integration/runtime-bridge/validateRuntime";

describe("Pack01 Runtime Bridge", () => {
  it("connects creator to FYP", () => {
    expect(connectCreatorToFypRuntime({ creatorId: "c1", videoId: "v1" }).connected).toBe(true);
  });

  it("injects creator identity", () => {
    const out = injectCreatorIdentity({}, { id: "c1", name: "A" });
    expect(out.creator.id).toBe("c1");
  });

  it("maps signals", () => {
    const out = mapHumanSignalsToFyp({}, [{ type: "present" }]);
    expect(out.signals.length).toBe(1);
  });

  it("attaches circle state", () => {
    const out = attachCircleState({}, { id: "circle1" });
    expect(out.circle.id).toBe("circle1");
  });

  it("validates runtime", () => {
    expect(validateRuntimeBridge({ creatorId: "c1", videoId: "v1" }).ok).toBe(true);
  });
});
