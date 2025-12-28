import { NextResponse } from "next/server";
import { getDemoCelebrations } from "../../../_lib/demo/content";

export const runtime = "nodejs";

export async function GET() {
  const celebrations = getDemoCelebrations();
  return NextResponse.json({ ok: true, celebrations }, { status: 200 });
}
