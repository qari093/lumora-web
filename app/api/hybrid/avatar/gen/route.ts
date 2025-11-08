import { NextResponse } from "next/server";
import { avatarSvg } from "@/app/_modules/hybrid/avatar";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const seed = url.searchParams.get("seed") || "A101";
    const size = Math.max(96, Math.min(512, Number(url.searchParams.get("size") || 160)));
    const svg = avatarSvg(seed, size);
    return new NextResponse(svg, {
      status: 200,
      headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "no-store" },
    });
  } catch (e: any) {
    return new NextResponse(String(e?.message || e), { status: 500 });
  }
}
