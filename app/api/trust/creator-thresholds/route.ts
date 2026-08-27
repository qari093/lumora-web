import { NextRequest, NextResponse } from "next/server";
import { calculateTrustScore } from "@/lib/trust/trustScore";
import { getCreatorThresholds } from "@/lib/trust/creatorThresholds";
import {
  evaluateConsequentialAutomationBoundary,
} from "@/src/core/governance/consequentialAutomationBoundary";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const trust = calculateTrustScore({
      reports: typeof body?.reports === "number" ? body.reports : 0,
      strikes: typeof body?.strikes === "number" ? body.strikes : 0,
      verified: Boolean(body?.verified),
      positiveEvents:
        typeof body?.positiveEvents === "number" ? body.positiveEvents : 0,
    });

    const thresholds = getCreatorThresholds(trust.level);

    return NextResponse.json({
      ok: true,
      source: "lumora_creator_thresholds_v1",
      constitutionalBoundary: {
        decisionClass: "advisory",
        governanceAuthorityGranted: false,
        consequentialActionAuthorized: evaluateConsequentialAutomationBoundary({
          decisionClass: "advisory",
          producedByAutomation: true,
        }).finalConsequentialActionAuthorized,
      },
      trust,
      thresholds,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "creator_thresholds_failed" },
      { status: 500 }
    );
  }
}
