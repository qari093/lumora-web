import { withSafeLive } from "@/lib/live/withSafeLive";
import { NextResponse } from "next/server";
import { endRoom } from "../../../_store";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: { id: string } }) {
  return withSafeLive(async () => {
  const id = String(ctx.params.id || "").trim();
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  const room = await endRoom(id);
  if (!room) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ room }, { status: 200 });
}
