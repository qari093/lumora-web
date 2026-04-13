import { NextRequest, NextResponse } from "next/server";
import { resolveDuel } from "@/lib/surge/duelState";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body?.duel || typeof body.duel !== "object") {
      return NextResponse.json(
        { ok: false, error: "missing_duel_payload" },
        { status: 400 }
      );
    }

    const duel = resolveDuel(body.duel);

    return NextResponse.json({
      ok: true,
      source: "lumora_duel_resolve_v1",
      duel,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "duel_resolve_failed" },
      { status: 500 }
    );
  }
}
