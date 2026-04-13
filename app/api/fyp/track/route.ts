import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body?.id || !body?.event) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    const payload = {
      id: body.id,
      event: body.event,
      ts: Date.now(),
      source: "fyp_tracking_v1"
    };

    console.log("FYP_TRACK_EVENT", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
