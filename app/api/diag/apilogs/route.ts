import { NextResponse } from "next/server";
import prisma from "@/src/lib/prisma";
export const runtime = "nodejs";
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("limit") ?? "10";
  const n = Number.parseInt(raw, 10);
  const limit = Number.isFinite(n) ? Math.min(Math.max(n,1), 50) : 10;
  try {
    const rows = await prisma.apiLog.findMany({ orderBy: { ts: "desc" }, take: limit });
    return NextResponse.json({ ok: true, rows });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: "DB_ERROR", message: err?.message ?? "Unknown DB error" }, { status: 500 });
  }
}
