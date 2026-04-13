import { NextRequest, NextResponse } from "next/server";
import { resolveFlashChallengeState } from "@/lib/surge/flashChallengeState";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.challenge || typeof body?.now !== "number") {
      return NextResponse.json(
        { ok: false, error: "missing_challenge_state_fields" },
        { status: 400 }
      );
    }

    const challenge = resolveFlashChallengeState(body.challenge, body.now);

    return NextResponse.json({
      ok: true,
      source: "lumora_flash_challenge_state_v1",
      challenge,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "challenge_state_failed" },
      { status: 500 }
    );
  }
}
