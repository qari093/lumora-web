import { NextRequest, NextResponse } from "next/server";
import { calculateTrustScore } from "@/lib/trust/trustScore";
import { getFeatureGate } from "@/lib/trust/featureGate";

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

    const gate = getFeatureGate(trust.level);

    return NextResponse.json({
      ok: true,
      source: "lumora_trust_gate_v1",
      trust,
      gate,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "trust_gate_failed" },
      { status: 500 }
    );
  }
}
