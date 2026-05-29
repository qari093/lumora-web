import { describe, expect, it } from "vitest";
import { createCivilizationSeal, LUMORA_FINAL_SEAL_INPUT } from "@/lib/final-seal/civilizationSeal";

describe("final civilization seal", () => {
  it("passes only when all civilization systems are ready", () => {
    const seal = createCivilizationSeal(LUMORA_FINAL_SEAL_INPUT);
    expect(seal.status).toBe("PASS");
    expect(seal.score).toBe(100);
    expect(seal.launchMode).toBe("PRIVATE_BETA");
  });
});
