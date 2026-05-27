import { describe, expect, it } from "vitest";
import { createSankalpa } from "@/src/monetization/sankalpa/create";
import { computeSankalpaInfluence } from "@/src/monetization/sankalpa/influence";
import { applySankalpaToState } from "@/src/monetization/sankalpa/apply";
import { validateSankalpaFlow } from "@/src/monetization/sankalpa/validate";

describe("Monetization Pack14 — Sankalpa System", () => {
  it("creates sankalpa", () => {
    const s = createSankalpa({
      userId: "u1",
      statement: " I am here to rest ",
      now: 1,
    });

    expect(s.statement).toBe("I am here to rest");
  });

  it("computes influence", () => {
    expect(computeSankalpaInfluence({ sankalpa: "rest" }).adTolerance).toBeLessThan(0.3);
  });

  it("applies influence", () => {
    const t = applySankalpaToState({
      baseTolerance: 0.5,
      sankalpaTolerance: 0.2,
    });

    expect(t).toBeLessThan(0.5);
  });

  it("validates flow", () => {
    expect(validateSankalpaFlow().ok).toBe(true);
  });
});
