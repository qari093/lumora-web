import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logErr } from "../_utils/log";

export async function GET() {
  try {
    // light sanity check: count wallets (works on empty too)
    const w = await prisma.wallet.count();
    return NextResponse.json({ ok: true, db: "up", wallets: w });
  } catch (e:any) {
    logErr("health", e);
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
