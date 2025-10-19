import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token") || "";
  return !!t && t === (process.env.ADMIN_TOKEN || "");
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });

    const minutes = 60;
    const since = new Date(Date.now() - minutes*60_000);

    // Safe helpers so we dont explode if certain tables dont exist yet
    const safeCount = async (fn: () => Promise<number>) => {
      try { return await fn(); } catch { return 0; }
    };
    const safeAgg = async <T>(fn: () => Promise<T>, fallback: T) => {
      try { return await fn(); } catch { return fallback; }
    };

    const wallets = await safeAgg(async () => {
      const rows = await prisma.wallet.findMany({ select:{ balanceCents:true } });
      const totalCents = rows.reduce((s,r)=> s + Number(r.balanceCents||0), 0);
      return { count: rows.length, totalCents };
    }, { count: 0, totalCents: 0 });

    const campaigns = await safeCount(async () => await prisma.campaign.count());
    const kycPending = await safeCount(async () => await prisma.kycRequest.count({ where:{ status: "PENDING" as any }}));
    const fraudLastHr = await safeCount(async () => await prisma.fraudLog.count({ where:{ createdAt:{ gte: since }}}));
    const eventsLastHr = await safeCount(async () => await prisma.adEvent.count({ where:{ createdAt:{ gte: since }}}));
    const convLastHr = await safeCount(async () => await prisma.adConversion.count({ where:{ createdAt:{ gte: since }}}));

    return NextResponse.json({
      ok: true,
      windowMinutes: minutes,
      wallets,
      campaigns,
      kycPending,
      activity: { eventsLastHr, convLastHr, fraudLastHr },
    });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
