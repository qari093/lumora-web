import { describe, expect, it } from "vitest";
import {
  aggregateSafety,
  applyCreatorTrustBypass,
  createSafetySignal,
  runCopyrightGate,
  runTechnicalGate,
  runVisualSafetyGate,
} from "@/src/content-engine/safety";

describe("Content Engine Pack06 — Safety Gates + License Proof", () => {
  it("blocks content failing technical gate", () => {
    const gate = runTechnicalGate({
      hasAudio: false,
      durationSec: 120,
      corrupted: true,
    });

    expect(gate.status).toBe("block");
    expect(gate.reasons).toContain("audio_missing");
  });

  it("blocks content with copyright match", () => {
    const gate = runCopyrightGate({
      perceptualHash: "abc",
      audioFingerprint: "xyz",
      knownFingerprints: [{ perceptualHash: "abc", audioFingerprint: "none" }],
    });

    expect(gate.status).toBe("block");
  });

  it("routes visual safety correctly", () => {
    expect(runVisualSafetyGate({ nsfwScore: 0.95 }).status).toBe("block");
    expect(runVisualSafetyGate({ nsfwScore: 0.6 }).status).toBe("review");
    expect(runVisualSafetyGate({ nsfwScore: 0.1 }).status).toBe("pass");
  });

  it("aggregates multiple gates into final decision", () => {
    const agg = aggregateSafety({
      contentId: "c1",
      gates: [
        { gate: "technical", status: "pass", reasons: [] },
        { gate: "visual", status: "review", reasons: ["nsfw_medium"] },
      ],
    });

    expect(agg.finalStatus).toBe("review");
  });

  it("applies creator trust bypass for review content", () => {
    const agg = aggregateSafety({
      contentId: "c1",
      gates: [
        { gate: "visual", status: "review", reasons: ["nsfw_medium"] },
      ],
    });

    const result = applyCreatorTrustBypass({
      aggregate: agg,
      creatorTrustScore: 0.85,
    });

    expect(result.finalStatus).toBe("safe");
  });

  it("creates correct safety signal event", () => {
    expect(
      createSafetySignal({
        aggregate: { contentId: "c1", finalStatus: "safe", gates: [] },
      }).eventType,
    ).toBe("content.safety.passed");

    expect(
      createSafetySignal({
        aggregate: { contentId: "c1", finalStatus: "blocked", gates: [] },
      }).eventType,
    ).toBe("content.safety.blocked");
  });
});
