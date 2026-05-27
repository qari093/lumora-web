import { describe, expect, it } from "vitest";
import { breathCycle } from "@/src/core/nexa-calm/breath/breathCycle";
import { recoveryMode } from "@/src/core/nexa-calm/recovery/recoveryMode";
import { emotionalValidation } from "@/src/core/nexa-calm/emotion/emotionalValidation";

describe("nexa breath recovery", () => {
  it("creates gentle breath cycle", () => {
    expect(breathCycle().gentle).toBe(true);
  });

  it("keeps recovery user controlled", () => {
    expect(recoveryMode.userControlled).toBe(true);
  });

  it("validates non diagnostic emotion safety", () => {
    expect(emotionalValidation().nonDiagnostic).toBe(true);
  });
});
