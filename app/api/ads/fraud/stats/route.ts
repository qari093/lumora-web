import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const minutes = Math.max(1, Math.min(24*60, Number(url.searchParams.get("minutes") || 60)));
    const since = new Date(Date.now() - minutes * 60_000);

    const events = await prisma.fraudEvent.findMany({
      where: { createdAt: { gte: since } },
      select: { kind: true, ip: true, createdAt: true },
    });

    const byKind: Record<string, number> = {};
    const byIp: Record<string, number> = {};
    for (const e of events) {
      byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
      if (e.ip) byIp[e.ip] = (byIp[e.ip] ?? 0) + 1;
    }
    const topIps = Object.entries(byIp).sort((a,b)=>b[1]-a[1]).slice(0,5)
      .map(([ip,count])=>({ ip, count }));

    return NextResponse.json({ ok: true, windowMinutes: minutes, total: events.length, byKind, topIps });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
