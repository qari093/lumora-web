import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const EMOJI_ROOT = path.join(PUBLIC_DIR, "persona", "emojis");
const ALLOWED_EXT = new Set([".svg", ".png", ".webp"]);

function listEmojiFiles() {
  if (!fs.existsSync(EMOJI_ROOT)) return { dir: EMOJI_ROOT, items: [] as Array<{ file: string; url: string }> };
  const items = fs.readdirSync(EMOJI_ROOT)
    .filter((file) => ALLOWED_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({ file, url: `/persona/emojis/${file}` }));
  return { dir: EMOJI_ROOT, items };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emotion = (searchParams.get("emotion") || "neutral").trim().toLowerCase();
  const reaction = (searchParams.get("reaction") || "love").trim().toLowerCase();
  const { dir, items } = listEmojiFiles();

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
