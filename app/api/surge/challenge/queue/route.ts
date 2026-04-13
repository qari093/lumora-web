import { NextRequest, NextResponse } from "next/server";
import { enqueueChallengeJob } from "@/lib/surge/challengeQueue";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.challengeId || !body?.submissionId || !body?.creatorId) {
      return NextResponse.json(
        { ok: false, error: "missing_queue_fields" },
        { status: 400 }
      );
    }

    const job = enqueueChallengeJob({
      challengeId: String(body.challengeId),
      submissionId: String(body.submissionId),
      creatorId: String(body.creatorId),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_challenge_queue_v1",
      job,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "challenge_queue_failed" },
      { status: 500 }
    );
  }
}
