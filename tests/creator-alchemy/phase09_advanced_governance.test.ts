import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import {
  evaluateAdvancedGovernance,
  reviewSponsorCompatibility,
  verifyMemorialPermission
} from "@/src/core/creator-alchemy/advanced-governance";

describe("Phase 09 — Advanced Safety + Governance Ω", () => {
  it("allows safe governance signals", () => {
    const decision = evaluateAdvancedGovernance({
      diagnosticLanguage: false,
      guiltPressureScore: 0,
      addictionLoopScore: 0.1,
      casinoEconomyScore: 0,
      burnoutRiskScore: 0.2,
      memorialConsentVerified: true,
      creatorConsentVerified: true,
      sponsorCompatible: true,
      manipulationScore: 0
    });

    expect(decision.allowed).toBe(true);
    expect(decision.severity).toBe("safe");
  });

  it("blocks diagnostic and casino signals", () => {
    const decision = evaluateAdvancedGovernance({
      diagnosticLanguage: true,
      guiltPressureScore: 0,
      addictionLoopScore: 0,
      casinoEconomyScore: 1,
      burnoutRiskScore: 0,
      memorialConsentVerified: true,
      creatorConsentVerified: true,
      sponsorCompatible: true,
      manipulationScore: 0
    });

    expect(decision.allowed).toBe(false);
    expect(decision.interventions).toContain("suppress_diagnostic_language");
    expect(decision.interventions).toContain("block_casino_economy");
  });

  it("requires memorial consent", () => {
    expect(
      verifyMemorialPermission({
        creatorPreApproved: true,
        familyVerified: false,
        documentationPresent: false
      })
    ).toBe(true);

    expect(
      verifyMemorialPermission({
        creatorPreApproved: false,
        familyVerified: true,
        documentationPresent: false
      })
    ).toBe(false);
  });

  it("reviews sponsor compatibility", () => {
    expect(
      reviewSponsorCompatibility({
        brandName: "Calm Studio",
        copy: "This week is quietly supported so creators can breathe.",
        constellationAtmosphere: "reflective quiet creative depth"
      })
    ).toBe(true);

    expect(
      reviewSponsorCompatibility({
        brandName: "Bad Growth",
        copy: "Guaranteed casino buy reach.",
        constellationAtmosphere: "reflective quiet creative depth"
      })
    ).toBe(false);
  });

  it("creates advanced governance API route", () => {
    expect(existsSync("app/api/creator-alchemy/advanced-governance/route.ts")).toBe(true);
    expect(readFileSync("app/api/creator-alchemy/advanced-governance/route.ts", "utf8")).toContain("evaluateAdvancedGovernance");
  });
});
