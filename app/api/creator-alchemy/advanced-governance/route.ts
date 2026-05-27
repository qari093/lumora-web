import { NextResponse } from "next/server";
import {
  evaluateAdvancedGovernance,
  reviewSponsorCompatibility,
  verifyMemorialPermission
} from "@/src/core/creator-alchemy/advanced-governance";

export const dynamic = "force-dynamic";

export async function GET() {
  const governance = evaluateAdvancedGovernance({
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

  const memorialAllowed = verifyMemorialPermission({
    creatorPreApproved: true,
    familyVerified: false,
    documentationPresent: false
  });

  const sponsorAllowed = reviewSponsorCompatibility({
    brandName: "Calm Studio",
    copy: "This week is quietly supported so creators can breathe.",
    constellationAtmosphere: "reflective quiet creative depth"
  });

  return NextResponse.json({
    ok: governance.allowed && memorialAllowed && sponsorAllowed,
    governance,
    memorialAllowed,
    sponsorAllowed
  });
}
