import { NextResponse } from "next/server";

export const runtime = "nodejs";
type Params = { id: string };

export async function POST(req: Request, ctx: { params: Promise<Params> | Params }) {
  const p: any = (ctx as any)?.params;
  const params: Params = typeof (p as any)?.then === "function" ? await p : p;
  const id = (params?.id || "").toString();
  if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

  let body: any = {};
  try { body = await req.json(); } catch {}
  const reaction = typeof body?.reaction === "string" ? body.reaction : "like";

  // Launch-safe stub: acknowledge reaction without persistence.
  return NextResponse.json({ ok: true, roomId: id, reaction, accepted: true, ts: new Date().toISOString() }, { status: 200 });
}
