import { NextResponse } from "next/server";

import {
  appendFypEvent,
  readRecentFypEvents
} from "@/src/core/fyp/runtime-tracking/fypEventStore";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      source: "fyp_tracking_v1",
      count: readRecentFypEvents(200).length,
      events: readRecentFypEvents(50)
    },
    {
      headers: {
        "cache-control": "no-store"
      }
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const saved = appendFypEvent(body);

    if (!saved) {
      return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
    }

    return NextResponse.json(
      {
        ok: true,
        source: "fyp_tracking_v1",
        saved
      },
      {
        headers: {
          "cache-control": "no-store"
        }
      }
    );
  } catch {
    return NextResponse.json({ ok: false, error: "tracking_failed" }, { status: 500 });
  }
}
