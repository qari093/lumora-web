import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const ownerId = url.searchParams.get("ownerId") || "OWNER_A";
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
