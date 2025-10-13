import { NextRequest, NextResponse } from "next/server";
import { publishGame } from "../_lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { title, templateId, ownerId } = body ?? {};
    const game = publishGame(String(title ?? ''), String(templateId ?? ''), String(ownerId ?? ''));
    return NextResponse.json({ ok: true, game }, { status: 201 });
  } catch (e:any) {
    return NextResponse.json({ ok:false, error:String(e?.message ?? e) }, { status:400 });
  }
}
