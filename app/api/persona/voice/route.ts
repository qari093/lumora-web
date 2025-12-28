import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { personaCode, isSpeaking, volume, emotionHint } = body || {};

    if (!personaCode) {
      return NextResponse.json({ error: "personaCode required" }, { status: 400 });
    }

    const state = await prisma.personaVoiceState.upsert({
      where: { personaCode },
      update: {
        isSpeaking: !!isSpeaking,
        volume: typeof volume === "number" ? volume : 0,
        emotionHint: emotionHint ?? null,
      },
      create: {
        personaCode,
        isSpeaking: !!isSpeaking,
        volume: typeof volume === "number" ? volume : 0,
        emotionHint: emotionHint ?? null,
      },
    });

    return NextResponse.json({ ok: true, state });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "voice ingest failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const personaCode = req.nextUrl.searchParams.get("personaCode");
  if (!personaCode) {
    return NextResponse.json({ error: "personaCode required" }, { status: 400 });
  }
  const state = await prisma.personaVoiceState.findUnique({ where: { personaCode } });
  return NextResponse.json({ state });
}
