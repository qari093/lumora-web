import { describe, expect, it } from "vitest";

import { validateSocialSignal } from "@/src/core/fyp/social/contracts/socialSignalContract";
import { amplifySocialSignal } from "@/src/core/fyp/social/runtime/socialAmplifier";
import { runSocialRuntime } from "@/src/core/fyp/social/runtime/socialRuntime";

describe(
  "Lumora FYP Social Signal Runtime Activation",
  () => {
    const signal = {
      id: "social-1",
      type: "share" as const,
      strength: 9
    };

    it("validates social signal", () => {
      expect(
        validateSocialSignal(signal)
      ).toBe(true);
    });

    it("creates viral score", () => {
      const result =
        amplifySocialSignal(signal);

      expect(result.viralScore).toBe(90);
    });

    it("detects amplified content", () => {
      const result =
        amplifySocialSignal(signal);

      expect(result.amplified).toBe(true);
    });

    it("supports weak signals", () => {
      const result =
        amplifySocialSignal({
          id: "social-2",
          type: "reaction",
          strength: 2
        });

      expect(result.amplified).toBe(false);
    });

    it("runs social runtime", () => {
      const runtime =
        runSocialRuntime([signal]);

      expect(runtime.active).toBe(true);
      expect(runtime.results).toHaveLength(1);
    });
  }
);
