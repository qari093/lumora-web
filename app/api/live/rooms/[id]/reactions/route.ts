import { NextResponse } from "next/server";

export const runtime = "nodejs";
type Params = { id: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> | Params }) {
  const p: any = (ctx as any)?.params;
  const params: Params = typeof (p as any)?.then === "function" ? await p : p;
  const id = (params?.id || "").toString();
  if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

  // Soft-launch feature freeze: an empty list is not represented as
  // persisted reaction state.
  return NextResponse.json(
    {
      ok: true,
      roomId: id,
      reactions: [],
      persisted: false,
      featureState: "deferred",
      reason: "reaction_persistence_not_active",
      ts: new Date().toISOString(),
    },
    { status: 200 },
  );
}
