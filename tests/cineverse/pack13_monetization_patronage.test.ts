import { describe, expect, it } from "vitest";
import {
  patronageTiers,
  createCinemaStone,
  createCivilizationTribute,
  validateInfrastructureRevenueRatio,
} from "../../src/cineverse/monetization/runtime";

describe("CineVerse Pack 13 — Monetization + Patronage", () => {
  it("creates ceremonial cinema stones", () => {
    const stone = createCinemaStone(10);

    expect(stone.ceremonial).toBe(true);
    expect(stone.transferable).toBe(false);
    expect(stone.speculative).toBe(false);
  });

  it("creates civilization tributes", () => {
    expect(patronageTiers).toContain("founder");

    const tribute = createCivilizationTribute("Quiet Ache");

    expect(tribute.ceremonial).toBe(true);
    expect(tribute.unlocks.length).toBeGreaterThan(0);
  });

  it("protects the 30% infrastructure ratio", () => {
    expect(
      validateInfrastructureRevenueRatio({
        monthlyInfraCost: 30,
        monthlyRevenue: 120,
      })
    ).toBe(true);

    expect(
      validateInfrastructureRevenueRatio({
        monthlyInfraCost: 80,
        monthlyRevenue: 120,
      })
    ).toBe(false);
  });
});
