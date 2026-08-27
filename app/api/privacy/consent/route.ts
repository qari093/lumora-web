import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest){
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  const url = new URL(req.url);
  const userId = auth.identity.userId;
  if(!userId) return NextResponse.json({ ok:false, error:"userId required" }, { status:400 });
  const c = await prisma.userConsent.findUnique({ where: { userId } });
  return NextResponse.json({ ok:true, consent: c || { userId, emotionProcessing:false, marketing:false } }, { headers:{ "Cache-Control":"no-store" }});
}

export async function POST(req: NextRequest){
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  const body = await req.json().catch(()=> ({}));
  const userId = auth.identity.userId;
  if(!userId) return NextResponse.json({ ok:false, error:"userId required" }, { status:400 });
  const emotionProcessing = !!body?.emotionProcessing;
  const marketing = !!body?.marketing;
  const saved = await prisma.userConsent.upsert({
    where:{ userId }, create:{ userId, emotionProcessing, marketing },
    update:{ emotionProcessing, marketing }
  });
  await prisma.consentEvent.create({ data: { userId, kind:"updated", data: { emotionProcessing, marketing } }});
  return NextResponse.json({ ok:true, consent:saved });
}
