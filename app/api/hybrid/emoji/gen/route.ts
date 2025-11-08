import { NextResponse } from "next/server";
import { generateEmojiSVG } from "@/app/_modules/hybrid/emoji/engine";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const seed = searchParams.get("seed") || "E001";
    const size = Math.max(64, Math.min(512, Number(searchParams.get("size") || 128)));
    const svg = generateEmojiSVG(seed, size);
    return new NextResponse(svg, {
      status: 200,
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "public, max-age=60",
      },
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message || e), { status: 500 });
  }
}
