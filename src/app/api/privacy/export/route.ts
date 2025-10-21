import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { encryptJSON } from "@/lib/privacy/crypto";

export async function POST(req: NextRequest){
  try{
    const body = await req.json().catch(()=> ({}));
    const userId = String(body?.userId || "");
    if(!userId) return NextResponse.json({ ok:false, error:"userId required" }, { status:400 });

    // Collect user-related data (creator profile + events)
    const creator = await prisma.creatorProfile.findUnique({ where: { userId } });
    const earningEvents = creator ? await prisma.earningEvent.findMany({ where: { creatorId: creator.id }, orderBy:{ createdAt:"desc" } }) : [];
    const consent = await prisma.userConsent.findUnique({ where: { userId } });
    const exportObj = { userId, consent, creator, earningEvents };

    // Encrypt package
    const encrypted = await encryptJSON(exportObj);

    const rec = await prisma.dataRequest.create({ data: { userId, type:"export", status:"done", payload: { size: JSON.stringify(exportObj).length } }});
    return NextResponse.json({ ok:true, requestId: rec.id, encrypted });
  }catch(e:any){
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:400 });
  }
}
