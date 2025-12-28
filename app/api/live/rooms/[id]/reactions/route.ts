import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextResponse } from "next/server";
import { listRoomReactions } from "../../../../live/_reactions_store";
import { getRoom } from "../../../_store";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: { id: string } }) {
  return withSafeLive(async () => {
  const id = String(ctx.params.id || "").trim();
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const room = await getRoom(id);
  if (!room) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const reactions = await listRoomReactions(id, 60);
  return NextResponse.json({ roomId: id, reactions, ts: new Date().toISOString() }, { status: 200 });
}
