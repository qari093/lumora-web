import { NextResponse } from "next/server";
import { generateEmojiSVG } from "@/app/modules/hybrid/emoji-gen";

export async function POST() {
  try {
    const emoji = await generateEmojiSVG();
    return NextResponse.json({ ok: true, ...emoji });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
