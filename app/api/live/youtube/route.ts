import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const now = Date.now();

    // TEMP seed (replace later with real API)
    const items = [
      {
        id: "youtube:seed1",
        source: "youtube",
        title: "Lumora Test Video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        media_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumb_url: "https://i3.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        media_type: "youtube",
        score_hint: 1000,
        final_score: 1000,
        ts: now,
        topic: "test"
      }
    ];

    const dir = path.join(process.cwd(), "data", "live_signals", "youtube");
    fs.mkdirSync(dir, { recursive: true });

    const file = path.join(dir, "latest.json");
    fs.writeFileSync(file, JSON.stringify(items, null, 2));

    return NextResponse.json({
      ok: true,
      data: {
        count: items.length,
        top: items
      }
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
