import { NextResponse } from "next/server";
import { EMOJI_CATEGORIES, animForEmojiDefault } from "@/app/_modules/emojis/emoji-data";

// Force dynamic so we always get fresh counts in dev
export const dynamic = "force-dynamic";

export async function GET() {
  const counts: Record<string, number> = {};
  for (const cat of EMOJI_CATEGORIES) {
    for (const e of cat.emojis) {
      const a = animForEmojiDefault(e, null);
      counts[a] = (counts[a] || 0) + 1;
    }
  }
  return NextResponse.json({ ok: true, counts });
}