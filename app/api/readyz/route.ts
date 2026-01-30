import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status, headers: { "cache-control": "no-store" } });
}

export async function GET() {
  const ts = Date.now();
  try {
    // DB ping
    await prisma.$queryRaw`SELECT 1`;
    return json({ ok: true, ts }, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "db_unavailable";
    return json({ ok: false, ts, error: "db_unavailable", detail: msg }, 503);
  }
}
