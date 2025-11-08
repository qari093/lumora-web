import { NextResponse } from "next/server";
import { getUploadPath } from "@/app/_modules/hybrid/uploads";
import { avatarSvg } from "@/app/_modules/hybrid/avatar";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const uploadId = url.searchParams.get("uploadId");
    const size = Math.max(120, Math.min(512, Number(url.searchParams.get("size") || 200)));
    if (!uploadId) return new NextResponse("missing uploadId", { status: 400 });

    // Validate file exists (we keep transform deterministic from id for now)
    const path = getUploadPath(uploadId);
    if (!path) return new NextResponse("upload not found", { status: 404 });

    const seed = `U-${uploadId}`;
    const svg = avatarSvg(seed, size);
    return new NextResponse(svg, { status: 200, headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "no-store" } });
  } catch (e: any) {
    return new NextResponse(String(e?.message || e), { status: 500 });
  }
}
