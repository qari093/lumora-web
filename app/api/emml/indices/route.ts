import { NextResponse } from "next/server";
import { store } from "../_store";

export const dynamic = "force-dynamic";

export async function GET() {
  // latest value per slug
  const latest: Record<string, { slug: string; value: number; ts: number }> = {};
  for (const r of store.readings) latest[r.slug] = r;
  return NextResponse.json({ ok: true, indices: Object.values(latest) });
}
