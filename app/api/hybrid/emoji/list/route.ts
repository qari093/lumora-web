import { NextResponse } from "next/server";
import { listCatalog } from "@/app/_modules/hybrid/emoji/engine";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const n = Math.max(1, Math.min(300, Number(searchParams.get("n") || 200)));
    const size = Math.max(48, Math.min(160, Number(searchParams.get("size") || 96)));
    const items = listCatalog(n, size);
    return NextResponse.json({ ok: true, items, count: items.length, ts: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
