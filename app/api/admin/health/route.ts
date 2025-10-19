import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token") || "";
  return !!t && t === (process.env.ADMIN_TOKEN || "");
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });
    const ping = await prisma.$queryRawUnsafe("SELECT 1 as ok");
    // Count most common tables if present
    const counts: Record<string, number> = {};
    const tryCount = async (name: string, run: () => Promise<number>) => {
      try { counts[name] = await run(); } catch { /* ignore */ }
    };
    await tryCount("Wallet", async ()=> prisma.wallet.count());
    await tryCount("Campaign", async ()=> prisma.campaign.count());
    await tryCount("CpvView", async ()=> prisma.cpvView.count());
    await tryCount("AdEvent", async ()=> prisma.adEvent.count());
    await tryCount("AdConversion", async ()=> prisma.adConversion.count());
    await tryCount("KycRequest", async ()=> prisma.kycRequest.count());
    await tryCount("FraudLog", async ()=> prisma.fraudLog.count());

    return NextResponse.json({ ok:true, db:"up", ping, counts });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
