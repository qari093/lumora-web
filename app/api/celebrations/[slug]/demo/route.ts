import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const body = await req.json().catch(() => ({}));
    const action = String(body?.action || "").toLowerCase();
    const userId = (req.headers.get("x-user-id") || "DEMO_USER_ID").trim();

    const c = await prisma.celebration.findFirst({ where: { slug } });
    if (!c) return NextResponse.json({ ok:false, error:"celebration not found" }, { status:404 });

    if (action === "join") {
      const exists = await prisma.celebrationParticipant.findFirst({
        where: { userId, celebrationId: c.id }
      });
      if (!exists) {
        await prisma.celebrationParticipant.create({
          data: { userId, celebrationId: c.id, joinedAt: new Date() }
        });
      }
    } else if (action === "react") {
      await prisma.celebrationReaction.create({
        data: { celebrationId: c.id, userId, kind: "MOOD", createdAt: new Date() } as any
      });
    } else if (action === "reward") {
      await prisma.celebrationReward.create({
        data: { celebrationId: c.id, userId, type: "ATTENDEE_PULSE", createdAt: new Date() } as any
      });
    } else {
      return NextResponse.json({ ok:false, error:"invalid action" }, { status:400 });
    }

    return NextResponse.json({ ok:true });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message || e) }, { status:500 });
  }
}
