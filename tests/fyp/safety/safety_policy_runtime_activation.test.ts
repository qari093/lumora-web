import { describe, expect, it } from "vitest";

import { validateSafetyInput } from "@/src/core/fyp/safety/contracts/safetyPolicyContract";
import { evaluateSafetyPolicy } from "@/src/core/fyp/safety/runtime/policyRules";
import { createFypSafetyRuntime } from "@/src/core/fyp/safety/runtime/safetyRuntime";

const safeInput = {
  itemId: "item_1",
  title: "Licensed Viral Clip",
  source: "seed",
  tags: ["culture"],
  hasLicenseProof: true
};

describe(
  "Lumora FYP Safety Policy Runtime Activation",
  () => {
    it("validates safety input", () => {
      expect(
        validateSafetyInput(safeInput)
      ).toBe(true);
    });

    it("allows safe licensed items", () => {
      const decision =
        evaluateSafetyPolicy(safeInput);

      expect(decision.level).toBe("allow");
      expect(decision.allowed).toBe(true);
    });

    it("blocks missing license proof", () => {
      const decision =
        evaluateSafetyPolicy({
          ...safeInput,
          hasLicenseProof: false
        });

      expect(decision.level).toBe("block");
      expect(decision.allowed).toBe(false);
    });

    it("blocks prohibited tags", () => {
      const decision =
        evaluateSafetyPolicy({
          ...safeInput,
          tags: ["pirated"]
        });

      expect(decision.level).toBe("block");
    });

    it("runs safety runtime", () => {
      const runtime =
        createFypSafetyRuntime();

      expect(
        runtime.canPublish(safeInput)
      ).toBe(true);
    });
  }
);
