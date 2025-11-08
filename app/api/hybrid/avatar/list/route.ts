import { NextResponse } from "next/server";
import { listSeeds, dataUrl } from "@/app/_modules/hybrid/avatar";
export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const n = Math.max(1, Math.min(60, Number(url.searchParams.get("n") || 24)));
    const size = Math.max(96, Math.min(256, Number(url.searchParams.get("size") || 160)));
    const seeds = listSeeds(n);
    const items = seeds.map(seed => ({
      id: `${seed}`,
      seed,
      preview: dataUrl(seed, size),
    }));
    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
