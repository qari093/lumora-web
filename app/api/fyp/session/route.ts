import { NextResponse } from "next/server";

type SessionPayload = {
  sessionId?: string;
  impressions?: number;
  clicks?: number;
  dwellMs?: number;
  feedIds?: string[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SessionPayload;

    if (!body?.sessionId) {
      return NextResponse.json({ ok: false, error: "missing_session_id" }, { status: 400 });
    }

    const payload = {
      sessionId: body.sessionId,
      impressions: Number(body.impressions || 0),
      clicks: Number(body.clicks || 0),
      dwellMs: Number(body.dwellMs || 0),
      feedIds: Array.isArray(body.feedIds) ? body.feedIds.slice(0, 50) : [],
      ts: Date.now(),
      source: "fyp_session_metrics_v1",
    };

    console.log("FYP_SESSION_METRICS", JSON.stringify(payload));

    return NextResponse.json({ ok: true, payload });
  } catch {
    return NextResponse.json({ ok: false, error: "session_metrics_failed" }, { status: 500 });
  }
}
