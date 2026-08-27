import { NextResponse } from "next/server";

export const runtime = "nodejs";
type Params = { id: string };

export async function GET(_req: Request, ctx: { params: Promise<Params> | Params }) {
  const p: any = (ctx as any)?.params;
  const params: Params = typeof (p as any)?.then === "function" ? await p : p;
  const id = (params?.id || "").toString();
  if (!id) return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });

  // The canonical active real-time event contract is /api/live/events.
  // This room-scoped compatibility route does not claim durable history.
  return NextResponse.json(
    {
      ok: true,
      roomId: id,
      events: [],
      persistedHistory: false,
      featureState: "compatibility_only",
      canonicalRealtimeRoute: "/api/live/events",
      ts: new Date().toISOString(),
    },
    { status: 200 },
  );
}
