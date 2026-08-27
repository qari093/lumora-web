import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Params = { id: string };

export async function POST(_req: Request, ctx: { params: Promise<Params> | Params }) {
  const p: any = (ctx as any)?.params;
  const params: Params = typeof (p as any)?.then === "function" ? await p : p;
  const id = (params?.id || "").toString();

  if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

  // Soft-launch feature freeze: never report an ended state unless
  // canonical room-state persistence has actually performed the mutation.
  return NextResponse.json(
    {
      ok: true,
      id,
      accepted: false,
      ended: false,
      persisted: false,
      featureState: "deferred",
      reason: "room_end_persistence_not_active",
      ts: new Date().toISOString(),
    },
    { status: 202 },
  );
}
