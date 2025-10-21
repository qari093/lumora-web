import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id:string }}) {
  try {
    const row = await prisma.campaign.findUnique({ where: { id: params.id }});
    if (!row) return NextResponse.json({ ok:false, error:"NOT_FOUND" }, { status:404 });
    return NextResponse.json({ ok:true, campaign: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id:string }}) {
  try {
    const body = await req.json().catch(()=> ({}));
    const data: any = {};
    if (typeof body.name === "string") data.name = body.name.slice(0,120);
    if (body.dailyBudgetCents != null) data.dailyBudgetCents = Math.max(0, Math.floor(Number(body.dailyBudgetCents)));
    if (body.targetingRadiusMiles != null) data.targetingRadiusMiles = Math.max(1, Math.floor(Number(body.targetingRadiusMiles)));
    if (typeof body.status === "string" && ["active","paused","archived"].includes(body.status)) data.status = body.status;
    const row = await prisma.campaign.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok:true, campaign: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id:string }}) {
  try {
    await prisma.campaign.delete({ where: { id: params.id }});
    return NextResponse.json({ ok:true, deleted:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
