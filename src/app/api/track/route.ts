import { NextResponse } from "next/server";

type TrackBody = {
  type: string;
  props?: Record<string, any>;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as TrackBody;

    if (!body?.type || typeof body.type !== "string") {
      return NextResponse.json(
        { ok: false, error: "missing_or_invalid_type" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // echo back event (placeholder for analytics store)
    return NextResponse.json(
      {
        ok: true,
        received: {
          type: body.type,
          props: body.props ?? {},
          ts: Date.now(),
        },
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
