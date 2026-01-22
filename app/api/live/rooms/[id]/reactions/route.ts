import { NextResponse } from "next/server";

export const runtime = "nodejs";
type Params = { id: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> | Params }) {
  const p: any = (ctx as any)?.params;
  const params: Params = typeof (p as any)?.then === "function" ? await p : p;
  const id = (params?.id || "").toString();
  if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

  // Launch-safe stub: return empty reactions list.
  return NextResponse.json({ ok: true, roomId: id, reactions: [], ts: new Date().toISOString() }, { status: 200 });
}
