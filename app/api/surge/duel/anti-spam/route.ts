import { NextRequest, NextResponse } from "next/server";
import { checkDuelSpam } from "@/lib/surge/duelAntiSpam";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.userId) {
      return NextResponse.json(
        { ok: false, error: "missing_user_id" },
        { status: 400 }
      );
    }

    const result = checkDuelSpam({
      userId: String(body.userId),
      lastVoteAt: typeof body?.lastVoteAt === "number" ? body.lastVoteAt : 0,
      now: typeof body?.now === "number" ? body.now : Date.now(),
      minIntervalMs:
        typeof body?.minIntervalMs === "number" ? body.minIntervalMs : 800,
    });

    return NextResponse.json(
      {
        ok: true,
        source: "lumora_duel_antispam_v1",
        ...result,
      },
      { status: result.allowed ? 200 : 429 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "antispam_failed" },
      { status: 500 }
    );
  }
}
