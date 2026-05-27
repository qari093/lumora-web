import { NextResponse } from "next/server";
import { buildRuntimeFypFeed } from "@/src/lib/content/runtime/buildRuntimeFypFeed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await buildRuntimeFypFeed([]);

  return NextResponse.json(feed, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
