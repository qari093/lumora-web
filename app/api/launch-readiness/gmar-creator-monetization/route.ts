import { NextResponse } from "next/server";
import { buildGmarCreatorMonetizationReport } from "@/src/core/launch-readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    data: buildGmarCreatorMonetizationReport(),
    meta: {
      domain: "launch_readiness",
      phase: "07",
      category: "gmar_creator_monetization_validation"
    }
  });
}
