import { describe, expect, it } from "vitest";
import { buildFinalSeal } from "../../src/lib/native-fyp/runtime/finalSeal";
import { verifyIntegrity } from "../../src/lib/native-fyp/runtime/integrity";

describe("native fyp pack 018", () => {
  it("builds final seal", () => {
    const s = buildFinalSeal();
    expect(s.nativeFyp).toBe(true);
  });

  it("verifies integrity", () => {
    const s = buildFinalSeal();
    expect(verifyIntegrity(s)).toBe(true);
  });
});
