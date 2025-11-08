import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(()=> ({} as any));
    const now = new Date();
    const pad = (n:number)=> String(n).padStart(2,"0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    const slug  = String(body.slug ?? `celebration-${stamp}`).toLowerCase().replace(/[^a-z0-9\-]+/g,"-");
    const title = String(body.title ?? "New Celebration");
    const startAt = body.startAt ? new Date(body.startAt) : now;

    const existing = await prisma.celebration.findUnique({ where: { slug } }).catch(()=>null) as any;
    if (existing) {
      return NextResponse.json({ ok:false, error:"slug already exists", slug }, { status: 409 });
    }

    const row = await prisma.celebration.create({
      data: { slug, title, status: "LIVE", startAt }
    } as any);

    return NextResponse.json({ ok:true, celebration: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status: 500 });
  }
}
