import { describe, expect, it } from "vitest";
import { identityContinuity } from "@/src/core/cross-portal/identity/identityContinuity";
import { emotionalCarryover } from "@/src/core/cross-portal/continuity/emotionalCarryover";
import { atmosphereValidator } from "@/src/core/cross-portal/atmosphere/atmosphereValidator";

describe("cross portal identity atmosphere", () => {
  it("keeps identity privacy safe", () => {
    expect(identityContinuity.privacySafe).toBe(true);
  });

  it("carries emotional signal safely", () => {
    expect(emotionalCarryover("calm").lowEgo).toBe(true);
  });

  it("validates shared atmosphere", () => {
    expect(atmosphereValidator().unified).toBe(true);
  });
});
