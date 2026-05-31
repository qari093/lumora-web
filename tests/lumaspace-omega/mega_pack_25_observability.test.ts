import { describe, expect, it } from "vitest";
import { createCivilizationMetric, createCivilizationPulse } from "@/src/core/lumaspace/omega/observability/pulseEngine";
import { createObservabilityEvent } from "@/src/core/lumaspace/omega/observability/eventEngine";
import { runLumaSpaceOmegaMegaPack25Runtime } from "@/src/core/lumaspace/omega/observability/omegaPack25Runtime";

describe("LumaSpace Ω∞ Mega Pack 25 — Observability", () => {
  it("creates metrics and pulse", () => {
    const pulse = createCivilizationPulse("c1", [createCivilizationMetric("bridges", 80)]);
    expect(pulse.status).toBe("healthy");
  });

  it("creates observability event", () => {
    const event = createObservabilityEvent({ severity: "info", message: "ok" });
    expect(event.system).toBe("lumaspace_omega");
  });

  it("runs full mega pack runtime", () => {
    expect(runLumaSpaceOmegaMegaPack25Runtime().ok).toBe(true);
  });
});
