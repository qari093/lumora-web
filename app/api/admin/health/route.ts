import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token") || "";
  return !!t && t === (process.env.ADMIN_TOKEN || "");
}

// Recursively convert BigInt to Number for JSON safety
function sanitizeBigInt(x: any): any {
  if (typeof x === "bigint") return Number(x);
  if (Array.isArray(x)) return x.map(sanitizeBigInt);
  if (x && typeof x === "object") {
    const out: any = {};
    for (const k of Object.keys(x)) out[k] = sanitizeBigInt((x as any)[k]);
    return out;
  }
  return x;
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });

    // Raw ping may return BigInt in some drivers; sanitize it.
    const pingRaw = await prisma.$queryRawUnsafe<any[]>(`SELECT 1 AS ok`);
    const ping = sanitizeBigInt(pingRaw);

    // Count common tables if present (guarded)
    const counts: Record<string, number> = {};
    const tryCount = async (name: string, run: () => Promise<number>) => {
      try { counts[name] = Number(await run()); } catch { /* ignore missing tables */ }
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
