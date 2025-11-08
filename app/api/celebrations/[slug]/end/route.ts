import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const c = await prisma.celebration.findFirst({ where: { slug } });
    if (!c) return NextResponse.json({ ok:false, error:"celebration not found" }, { status:404 });

    if (c.status !== "ENDED") {
      await prisma.celebration.update({ where: { id: c.id }, data: { status: "ENDED" } });
    }
    return NextResponse.json({ ok:true, status:"ENDED" });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message||e) }, { status:500 });
  }
}

export const dynamic = "force-dynamic";
