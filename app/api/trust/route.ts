import { NextRequest, NextResponse } from "next/server";
import {
  calculateTrustScore,
  canAccessSurgeFeatures,
} from "@/lib/trust/trustScore";

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

    return NextResponse.json({
      ok: true,
      source: "lumora_trust_score_v1",
      trust,
      surgeAccess: canAccessSurgeFeatures(trust.level),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "trust_score_failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const trust = calculateTrustScore({
    reports: 0,
    strikes: 0,
    verified: false,
    positiveEvents: 0,
  });

  return NextResponse.json({
    ok: true,
    source: "lumora_trust_score_v1",
    trust,
    surgeAccess: canAccessSurgeFeatures(trust.level),
  });
}
