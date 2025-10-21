export const runtime = "nodejs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureWallet } from "../../../lib/wallet";

export async function GET() {
  try {
    const items = await prisma.wallet.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ ok: true, items });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(()=>({}));
    const ownerId = String(b?.ownerId || "").trim();
    if (!ownerId) return NextResponse.json({ ok:false, error:"ownerId required" }, { status:400 });
    const w = await ensureWallet(ownerId);
    return NextResponse.json({ ok:true, wallet:w }, { status:201 });
  } catch (e: any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
