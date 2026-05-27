import { NextResponse } from "next/server";
import { buildSeedFeed } from "@/src/lib/native-fyp/feed/seed";
import { buildEventsFallback } from "@/src/lib/native-fyp/feed/fallback";

export async function GET() {
  try {
    let items = buildSeedFeed();

    if (!items.length) {
      items = buildEventsFallback();
      return NextResponse.json({
        ok: true,
        source: "native_fyp",
        fallback: "events",
        count: items.length,
        items,
      });
    }

    return NextResponse.json({
      ok: true,
      source: "native_fyp",
      count: items.length,
      items,
    });
  } catch (e: any) {
    const fallback = buildEventsFallback();
    return NextResponse.json({
      ok: true,
      source: "native_fyp",
      fallback: "events",
      count: fallback.length,
      items: fallback,
    });
  }
}
