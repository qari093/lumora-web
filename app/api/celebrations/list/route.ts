import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const rows = await prisma.celebration.findMany({
      select: { id: true, slug: true, title: true, status: true, startAt: true, createdAt: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ ok: true, items: rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
