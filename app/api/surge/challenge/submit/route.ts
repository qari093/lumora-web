import { NextRequest, NextResponse } from "next/server";
import { createChallengeSubmission } from "@/lib/surge/challengeSubmission";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.challengeId || !body?.creatorId || !body?.contentId) {
      return NextResponse.json(
        { ok: false, error: "missing_submission_fields" },
        { status: 400 }
      );
    }

    const submission = createChallengeSubmission({
      challengeId: String(body.challengeId),
      creatorId: String(body.creatorId),
      contentId: String(body.contentId),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_challenge_submission_v1",
      submission,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "challenge_submission_failed" },
      { status: 500 }
    );
  }
}
