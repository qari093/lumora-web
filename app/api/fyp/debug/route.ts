import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      endpoint: "/api/fyp/debug",
      note: "FYP debug endpoint is wired and responding.",
      sample: [
        { id: "dbg-1", title: "Debug Clip 1", mood: "neutral" },
        { id: "dbg-2", title: "Debug Clip 2", mood: "joy" },
        { id: "dbg-3", title: "Debug Clip 3", mood: "calm" },
      ],
      ts: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" }});
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "debug_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
