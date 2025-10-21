import { NextResponse } from "next/server";
import { prisma } from "../../../src/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: "up" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, db: "down", error: err?.message || String(err) },
      { status: 503 }
    );
  }
}
export const runtime = "nodejs";
