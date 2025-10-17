import { NextResponse } from "next/server";

type Req = { mood?: string; limit?: number };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Req;
    const mood = (body.mood ?? "neutral").toLowerCase();
    const limit = Math.max(1, Math.min(20, Number(body.limit ?? 3)));

    // simple stubbed recommendations based on mood
    const library = [
      { id: "rec-joy-1", mood: "joy", title: "Joy Sparks", url: "/videos/joy-1.mp4", _score: 82 },
      { id: "rec-joy-2", mood: "joy", title: "Sunny Vibes", url: "/videos/joy-2.mp4", _score: 80 },
      { id: "rec-neutral-1", mood: "neutral", title: "Chill Flow", url: "/videos/neutral-1.mp4", _score: 70 },
      { id: "rec-calm-1", mood: "calm", title: "Deep Breaths", url: "/videos/calm-1.mp4", _score: 76 },
      { id: "rec-focus-1", mood: "focus", title: "Focus Stream", url: "/videos/focus-1.mp4", _score: 74 },
    ];

    const rows = library
      .filter(v => v.mood === mood || mood === "neutral")
      .slice(0, limit);

    return NextResponse.json({
      ok: true,
      endpoint: "/api/fyp/recommend",
      input: { mood, limit },
      count: rows.length,
      rows,
      ts: new Date().toISOString(),
    }, { headers: { "Cache-Control": "no-store" }});
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "recommend_failed" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

// Optional GET handler to help with quick browser checks
export async function GET() {
  return NextResponse.json({
    ok: true,
    method: "GET",
    tip: "POST { mood, limit } for actual recommendations."
  });
}
