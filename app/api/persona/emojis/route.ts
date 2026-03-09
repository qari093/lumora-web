import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ROOT = process.cwd();
const EMOJI_ROOT = path.join(ROOT, "public", "persona", "emojis");
const EXT_OK = new Set([".svg", ".png", ".webp"]);

function allEmojiFiles(): string[] {
  if (!fs.existsSync(EMOJI_ROOT)) return [];
  return fs.readdirSync(EMOJI_ROOT)
    .filter((file) => EXT_OK.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}

function matchReaction(file: string, reaction: string): boolean {
  const f = file.toLowerCase();
  const r = reaction.toLowerCase();
  if (!r || r === "all") return true;
  if (f.includes(r)) return true;
  if (r === "love" && (f.includes("heart") || f.includes("kiss") || f.includes("hug") || f.includes("aura"))) return true;
  if (r === "happy" && (f.includes("smile") || f.includes("joy") || f.includes("grin"))) return true;
  if (r === "surprised" && (f.includes("astonished") || f.includes("shock") || f.includes("wow"))) return true;
  return false;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emotion = (searchParams.get("emotion") || "neutral").trim().toLowerCase();
  const reaction = (searchParams.get("reaction") || "love").trim().toLowerCase();

  const files = allEmojiFiles();
  let picked = files.filter((file) => matchReaction(file, reaction));
  if (picked.length === 0) picked = files;

  const items = picked.map((file) => ({
    file,
    url: `/persona/emojis/${file}`,
  }));

  return NextResponse.json({
    ok: true,
    type: "emoji",
    emotion,
    reaction,
    count: items.length,
    dir: EMOJI_ROOT,
    items,
  });
}
