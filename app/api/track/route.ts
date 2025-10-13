import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    if (!body?.type) {
      return NextResponse.json(
        { ok: false, error: "missing_type" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        received: { type: body.type, props: body.props ?? {}, ts: Date.now() },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "unknown_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
