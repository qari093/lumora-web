import { NextResponse } from "next/server";
import { ensureWallet } from "@/lib/wallet";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ownerId = body?.ownerId || "";
    if (!ownerId) return NextResponse.json({ ok:false, error:"MISSING_OWNER" }, { status: 400 });
    const wallet = await ensureWallet(ownerId);
    return NextResponse.json({ ok:true, wallet });
  } catch (e:any) {
    console.error("[wallet:ensure] error:", e?.message || e);
    return NextResponse.json({ ok:false, error:"SERVER_ERROR" }, { status: 500 });
  }
}
