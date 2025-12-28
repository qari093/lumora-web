import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextRequest, NextResponse } from "next/server";
import { liveStore, type LiveReactionKind } from "@/app/live/_store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  return withSafeLive(async () => {
  const { id } = await ctx.params;

  let payload: any = null;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const kind = String(payload?.kind || "").toLowerCase() as LiveReactionKind;
  const refId = String(payload?.refId || "").trim();

  if (kind !== "emoji" && kind !== "avatar") return json(400, { error: "invalid_kind" });
  if (!refId) return json(400, { error: "missing_refId" });

  try {
    const reaction = liveStore.addReaction(id, kind, refId);
    return json(200, { ok: true, reaction });
  } catch (e: any) {
    const code = String(e?.code || "");
    if (code === "ROOM_NOT_FOUND") return json(404, { error: "room_not_found" });
    if (code === "ROOM_ENDED") return json(409, { error: "room_ended" });
    return json(500, { error: "server_error" });
  }
}
