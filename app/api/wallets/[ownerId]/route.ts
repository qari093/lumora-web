import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, ctx: { params: { ownerId: string } }) {
  try {
    const { ownerId } = ctx.params || ({} as any);
    if (!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER" }, { status: 400 });
    const wallet = await prisma.wallet.findUnique({ where: { ownerId } });
    return NextResponse.json({ ok:true, wallet });
  } catch (e:any) {
    console.error("[wallet:get] error:", e?.message || e);
    return NextResponse.json({ ok:false, error:"SERVER_ERROR" }, { status: 500 });
  }
}
