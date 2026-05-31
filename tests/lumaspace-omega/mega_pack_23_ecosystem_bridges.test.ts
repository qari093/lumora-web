import { describe, expect, it } from "vitest";
import { createEcosystemEvent } from "@/src/core/lumaspace/omega/ecosystem-bridges/eventEngine";
import { createEcosystemMemory } from "@/src/core/lumaspace/omega/ecosystem-bridges/memoryBridge";
import { createEcosystemSignal } from "@/src/core/lumaspace/omega/ecosystem-bridges/signalBridge";
import { runLumaSpaceOmegaMegaPack23Runtime } from "@/src/core/lumaspace/omega/ecosystem-bridges/omegaPack23Runtime";

describe("LumaSpace Ω∞ Mega Pack 23 — Ecosystem Bridges", () => {
  it("creates eligible portal events", () => {
    const event = createEcosystemEvent({ portal: "gmar", citizenId: "u1", sourceId: "a1", eventType: "achievement" });
    expect(event.memoryEligible).toBe(true);
  });

  it("creates memory bridge", () => {
    const event = createEcosystemEvent({ portal: "live", citizenId: "u1", sourceId: "l1", eventType: "room" });
    expect(createEcosystemMemory(event).destination).toBe("community_tree");
  });

  it("creates signal bridge", () => {
    const event = createEcosystemEvent({ portal: "fyp", citizenId: "u1", sourceId: "f1", eventType: "seen" });
    expect(createEcosystemSignal(event).pulseEligible).toBe(true);
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack23Runtime().ok).toBe(true);
  });
});
