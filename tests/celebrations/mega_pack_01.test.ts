import { describe, expect, it } from "vitest";
import { CELEBRATION_CONSTITUTION } from "@/src/core/celebrations/contracts/constitution";
import { createCelebrationState } from "@/src/core/celebrations/runtime/emotionalState";
import { createCASRuntime } from "@/src/core/celebrations/cas/celebrationAtmosphereStack";

describe("Celebrations Mega Pack 01", () => {
  it("loads constitution", () => {
    expect(CELEBRATION_CONSTITUTION.noDashboard).toBe(true);
  });

  it("creates state", () => {
    expect(createCelebrationState().mode).toBe("neutral");
  });

  it("creates CAS runtime", () => {
    expect(createCASRuntime().active).toBe(true);
  });
});
