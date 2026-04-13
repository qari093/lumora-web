import { NextRequest, NextResponse } from "next/server";
import { applyDuelVote } from "@/lib/surge/duelVote";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.duel || !body?.side || typeof body?.watchSeconds !== "number") {
      return NextResponse.json(
        { ok: false, error: "missing_vote_fields" },
        { status: 400 }
      );
    }

    const result = applyDuelVote({
      duel: body.duel,
      side: body.side,
      watchSeconds: body.watchSeconds,
      minWatchSeconds:
        typeof body?.minWatchSeconds === "number" ? body.minWatchSeconds : 5,
    });

    return NextResponse.json(
      {
        ok: true,
        source: "lumora_duel_vote_v1",
        ...result,
      },
      { status: result.accepted ? 200 : 422 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "duel_vote_failed" },
      { status: 500 }
    );
  }
}
