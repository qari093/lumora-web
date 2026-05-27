import { describe, expect, it } from "vitest";
import { calculatePresenceDividend } from "@/src/core/celebrations/economy/presenceDividends";
import { createFusionNebula } from "@/src/core/celebrations/fusion/fusionNebulae";

describe("Celebrations Mega Pack 08", () => {
  it("calculates dividend", () => {
    expect(calculatePresenceDividend()).toBe(5);
  });

  it("creates nebula", () => {
    expect(createFusionNebula().stable).toBe(true);
  });
});
