import { NextRequest, NextResponse } from "next/server";
import { calculateVoteAudit } from "@/lib/surge/voteAudit";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.duelId || typeof body?.totalVotes !== "number") {
      return NextResponse.json(
        { ok: false, error: "missing_vote_audit_fields" },
        { status: 400 }
      );
    }

    const result = calculateVoteAudit({
      duelId: String(body.duelId),
      totalVotes: body.totalVotes,
      suspiciousVotes:
        typeof body?.suspiciousVotes === "number" ? body.suspiciousVotes : 0,
      sampleRate:
        typeof body?.sampleRate === "number" ? body.sampleRate : 0.1,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_vote_audit_v1",
      duelId: String(body.duelId),
      ...result,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "vote_audit_failed" },
      { status: 500 }
    );
  }
}
