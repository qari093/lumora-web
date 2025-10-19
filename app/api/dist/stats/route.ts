import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const days = Math.max(1, Math.min(90, Number(url.searchParams.get("days") || 7)));
    const since = new Date(Date.now() - days*86400000);

    // Group by channel
    const grouped = await prisma.channelHit.groupBy({
      by: ["channel"],
      where: { createdAt: { gte: since } },
      _count: { _all: true }
    });
    const byChannel = Object.fromEntries(grouped.map(g => [g.channel, Number((g as any)._count?._all || 0)]));

    // Top 10 links
    const top = await prisma.shortLink.findMany({
      orderBy: { clicks: "desc" },
      take: 10,
      select: { slug:true, targetUrl:true, clicks:true, createdAt:true }
    });

    return NextResponse.json({ ok:true, days, byChannel, top });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
