import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id:string }}) {
  try {
    const body = await req.json().catch(()=> ({}));
    const data: any = {};
    ["imageUrl","headline","description","ctaText"].forEach(k=>{ if (typeof (body as any)[k] === "string") (data as any)[k] = (body as any)[k]; });
    const row = await prisma.adCreative.update({ where: { id: params.id }, data });
    return NextResponse.json({ ok:true, creative: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id:string }}) {
  try {
    await prisma.adCreative.delete({ where: { id: params.id }});
    return NextResponse.json({ ok:true, deleted:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
