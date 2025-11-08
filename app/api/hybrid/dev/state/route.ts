import { NextResponse } from "next/server";
import { snapshot } from "@/app/_modules/hybrid/state";
export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json({ ok: true, data: snapshot(), ts: Date.now() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
