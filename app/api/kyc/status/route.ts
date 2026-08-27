import { requireUserSession, userPrivateNoStoreHeaders } from "@/src/lib/auth/requireUserSession";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = await requireUserSession();
  if (!auth.ok) return auth.response;
  try {
    const url = new URL(req.url);
    const ownerId = auth.identity.userId;
    const row = await prisma.kycRequest.findFirst({
      where: { ownerId },
      orderBy: { createdAt: "desc" },
      include: { documents: true },
    });
    return NextResponse.json({ ok:true, ownerId, request: row });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
