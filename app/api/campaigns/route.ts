import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const clamp = (n:number, lo:number, hi:number)=> Math.max(lo, Math.min(hi, Math.floor(n)));

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim();
    const where = q ? { name: { contains: q, mode: "insensitive" as const } } : {};
    const rows = await prisma.campaign.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ ok:true, rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({}));
    const { id, name, dailyBudgetCents, targetingRadiusMiles = 50, status = "active" } = body || {};
    if (!name || typeof name !== "string") return NextResponse.json({ ok:false, error:"NAME_REQUIRED" }, { status:400 });

    const data = {
      name: String(name).slice(0,120),
      dailyBudgetCents: clamp(Number(dailyBudgetCents ?? 500), 0, 10_000_000),
      targetingRadiusMiles: clamp(Number(targetingRadiusMiles ?? 50), 1, 500),
      status: ["active","paused","archived"].includes(String(status)) ? String(status) : "active",
    };

    const row = id
      ? await prisma.campaign.update({ where: { id: String(id) }, data })
      : await prisma.campaign.create({ data });

    return NextResponse.json({ ok:true, campaign: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
