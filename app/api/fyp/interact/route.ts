import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { videoId, action, mood, ms } = await req.json();

    if (!videoId || !action) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const saved = await prisma.interaction.create({
      data: {
        videoId,
        action,
        mood: typeof mood === "string" ? mood : null,
        ms: typeof ms === "number" ? ms : null,
      },
    });

    return NextResponse.json({ ok: true, saved });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
