import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";
import { NextResponse } from "next/server";
import { reset } from "@/app/_modules/hybrid/state";
export const runtime = "nodejs";

export async function POST() {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  try {
    reset();
    return NextResponse.json({ ok: true, cleared: true, ts: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
