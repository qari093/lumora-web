import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ROOT = process.cwd();
const EMOJI_ROOT = path.join(ROOT, "public", "persona", "emojis");
const ALLOWED_EXT = new Set([".svg", ".png", ".webp"]);

function looksLikeReaction(file: string, reaction: string): boolean {
  const base = file.toLowerCase();
  const r = reaction.toLowerCase();
  if (r === "all") return true;
  if (base.includes(r)) return true;

  const aliases: Record<string, string[]> = {
    love: ["love", "heart", "kiss", "hug", "aura"],
    happy: ["happy", "smile", "joy", "grin"],
    sad: ["sad", "cry", "tear"],
    angry: ["angry", "mad", "rage"],
    surprised: ["surprised", "shock", "astonished", "wow"],
    wink: ["wink"],
    calm: ["calm"],
  };

  return (aliases[r] || []).some((token) => base.includes(token));
}

function listEmojiFiles(reaction: string) {
  if (!fs.existsSync(EMOJI_ROOT)) {
    return { dir: EMOJI_ROOT, items: [] as Array<{ file: string; url: string }> };
  }

  const all = fs.readdirSync(EMOJI_ROOT)
    .filter((file) => ALLOWED_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  let filtered = all.filter((file) => looksLikeReaction(file, reaction));

  if (filtered.length === 0) {
    filtered = all;
  }

  return {
    dir: EMOJI_ROOT,
    items: filtered.map((file) => ({
      file,
      url: `/persona/emojis/${file}`
    }))
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emotion = (searchParams.get("emotion") || "neutral").trim().toLowerCase();
  const reaction = (searchParams.get("reaction") || "love").trim().toLowerCase();
  const { dir, items } = listEmojiFiles(reaction);

  return NextResponse.json({
    ok: true,
    type: "emoji",
    emotion,
    reaction,
    count: items.length,
    dir,
    items
  });
}
