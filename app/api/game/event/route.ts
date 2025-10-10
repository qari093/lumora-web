import { NextRequest, NextResponse } from "next/server";
import { applyGameEvent, type GameEvent } from "@/lib/integrations/econ-bridge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as Partial<GameEvent>;
    const ev: GameEvent = {
      type: (body.type || "MATCH_WIN") as GameEvent["type"],
      userId: body.userId || req.headers.get("x-user-id") || "demo-user",
      amount: typeof body.amount === "number" ? Math.floor(body.amount) : undefined,
      note: body.note,
      meta: body.meta || {}
    };
    const result = await applyGameEvent(ev);
    return NextResponse.json({ ok: true, event: ev, ...result });
  } catch (err: any) {
    console.error("[/api/game/event] Error:", err?.stack || err);
    return NextResponse.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
