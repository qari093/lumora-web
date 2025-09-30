import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/db";
import { isAdmin } from "../../../../../lib/admin";

export const runtime = "nodejs";

// simple detector: frequency, invalid token history (left as hint), ultra scores, ip reuse
export async function GET(req:Request){
  const h = new Headers(req.headers);
  if (!isAdmin(h)) return NextResponse.json({ok:false,error:"unauthorized"},{status:401});

  // count scores in last 10 minutes per device
  const since = new Date(Date.now()-10*60*1000);
  const scores = await prisma.score.groupBy({
    by:["deviceId"],
    where:{ createdAt: { gte: since } },
    _count:{ _all:true },
  });

  // high values (cheat suspicion)
  const top = await prisma.score.findMany({ orderBy:{ value:"desc" }, take:50 });

  // duplicate IP from events
  const evs = await prisma.event.findMany({ where:{ createdAt:{ gte: since } }, take:1000 });
  const byIp = new Map<string, Set<string>>();
  for(const e of evs){
    const ip = (e.data as any)?.ip;
    const dev = e.deviceId||"";
    if (!ip || !dev) continue;
    if (!byIp.has(ip)) byIp.set(ip,new Set());
    byIp.get(ip)!.add(dev);
  }
  const sharedIp = [...byIp.entries()].filter(([_,s])=>s.size>3).map(([ip,s])=>({ip,count:s.size}));

  const freq = scores.filter(s=> (s._count._all||0) > 20).map(s=>({ deviceId:s.deviceId, count:s._count._all }));
  return NextResponse.json({ ok:true, freq, high: top, sharedIp });
}
