import { NextRequest, NextResponse } from "next/server";
import { createFlashChallenge } from "@/lib/surge/flashChallengeSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.title ||
      !body?.prompt ||
      typeof body?.rewardPool !== "number" ||
      typeof body?.durationMinutes !== "number"
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_challenge_fields" },
        { status: 400 }
      );
    }

    const challenge = createFlashChallenge({
      title: String(body.title),
      prompt: String(body.prompt),
      rewardPool: body.rewardPool,
      durationMinutes: body.durationMinutes,
      startsAt: typeof body?.startsAt === "number" ? body.startsAt : undefined,
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_flash_challenge_v1",
      challenge,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "challenge_create_failed" },
      { status: 500 }
    );
  }
}
