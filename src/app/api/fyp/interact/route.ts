import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { videoId, action, positionMs, extra } = body || {};

    if (!videoId || !action) {
      return NextResponse.json(
        { ok: false, error: "Missing videoId or action" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // TODO: replace with real persistence/analytics
    // For now we just echo back what was received.
    const payload = {
      ok: true,
      received: {
        videoId,
        action,          // e.g. "like" | "skip" | "complete" | "replay" | "share"
        positionMs: Number(positionMs ?? 0),
        extra: extra ?? null,
        ts: Date.now(),
      },
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "unknown_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
