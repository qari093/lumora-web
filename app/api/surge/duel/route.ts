import { NextRequest, NextResponse } from "next/server";
import { createDuelMatch } from "@/lib/surge/duelSchema";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (
      !body?.leftCreatorId ||
      !body?.leftContentId ||
      !body?.rightCreatorId ||
      !body?.rightContentId
    ) {
      return NextResponse.json(
        { ok: false, error: "missing_duel_fields" },
        { status: 400 }
      );
    }

    const duel = createDuelMatch({
      mode: body?.mode === "chill" ? "chill" : "surge",
      leftCreatorId: String(body.leftCreatorId),
      leftContentId: String(body.leftContentId),
      rightCreatorId: String(body.rightCreatorId),
      rightContentId: String(body.rightContentId),
    });

    return NextResponse.json({
      ok: true,
      source: "lumora_duel_schema_v1",
      duel,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "duel_create_failed" },
      { status: 500 }
    );
  }
}
