import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function isAdmin(req: Request) {
  const t = req.headers.get("x-admin-token") || "";
  return !!t && t === (process.env.ADMIN_TOKEN || "");
}

export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ ok:false, error:"UNAUTHORIZED" }, { status:401 });
    const rows = await prisma.kycRequest.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      include: { documents: true },
    });
    return NextResponse.json({ ok:true, pending: rows });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}
