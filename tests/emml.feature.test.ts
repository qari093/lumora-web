// @ts-nocheck
import { describe, it, expect } from "vitest";
import { isEmmlEnabled, getEmmlDisableReason } from "../lib/emml/feature";

describe("EMML Feature Flag — Helper", () => {
  const originalEnabled = process.env.EMML_ENABLED;
  const originalReason = process.env.EMML_DISABLE_REASON;

  const resetEnv = () => {
    if (originalEnabled === undefined) {
      delete process.env.EMML_ENABLED;
    } else {
      process.env.EMML_ENABLED = originalEnabled;
    }

    if (originalReason === undefined) {
      delete process.env.EMML_DISABLE_REASON;
    } else {
      process.env.EMML_DISABLE_REASON = originalReason;
    }
  };

  it("should default to enabled when EMML_ENABLED is not set", () => {
    delete process.env.EMML_ENABLED;
    expect(isEmmlEnabled()).toBe(true);
    resetEnv();
  });

  it("should treat EMML_ENABLED=false as disabled", () => {
    process.env.EMML_ENABLED = "false";
    expect(isEmmlEnabled()).toBe(false);
    resetEnv();
  });

  it("should treat common falsey strings as disabled", () => {
    const falsey = ["0", "OFF", "disable", "DISABLED", " off  "];

    for (const v of falsey) {
      process.env.EMML_ENABLED = v;
      expect(isEmmlEnabled()).toBe(false);
    }

    resetEnv();
  });

  it("should surface a disable reason when EMML is disabled", () => {
    process.env.EMML_ENABLED = "false";
    delete process.env.EMML_DISABLE_REASON;

    const reasonDefault = getEmmlDisableReason();
    expect(typeof reasonDefault).toBe("string");
    expect(reasonDefault).toContain("disabled");

    process.env.EMML_DISABLE_REASON = "EMML under maintenance window.";
    const reasonCustom = getEmmlDisableReason();
    expect(reasonCustom).toBe("EMML under maintenance window.");

    resetEnv();
  });

  it("should return null reason when EMML is enabled", () => {
    delete process.env.EMML_ENABLED;
    process.env.EMML_DISABLE_REASON = "Some value";

    expect(isEmmlEnabled()).toBe(true);
    expect(getEmmlDisableReason()).toBeNull();

    resetEnv();
  });
});
