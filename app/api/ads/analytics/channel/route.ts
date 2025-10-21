import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
    const since = new Date(Date.now() - days*86400000);

    const grouped = await prisma.adConversion.groupBy({
      by: ["channel"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      _sum: { rewardCents: true },
    } as any);

    const rows = grouped.map((g:any)=>({
      channel: g.channel || "unknown",
      conversions: Number(g._count?._all || 0),
      rewardsCents: Number(g._sum?.rewardCents || 0),
    })).sort((a,b)=> b.conversions - a.conversions);

    return NextResponse.json({ ok:true, days, rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
