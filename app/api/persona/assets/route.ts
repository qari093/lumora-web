import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const AVATAR_ROOT = path.join(PUBLIC_DIR, "persona", "avatars");
const ALLOWED_EXT = new Set([".svg", ".png", ".webp"]);

function listEmotionFiles(emotion: string) {
  const dir = path.join(AVATAR_ROOT, emotion);
  if (!fs.existsSync(dir)) return { dir, items: [] as Array<{ file: string; url: string }> };
  const items = fs.readdirSync(dir)
    .filter((file) => ALLOWED_EXT.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({ file, url: `/persona/avatars/${emotion}/${file}` }));
  return { dir, items };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emotion = (searchParams.get("emotion") || "neutral").trim().toLowerCase();
  const reaction = (searchParams.get("reaction") || "love").trim().toLowerCase();
  const { dir, items } = listEmotionFiles(emotion);

  return NextResponse.json({
    ok: true,
    type: "avatar",
    emotion,
    reaction,
    count: items.length,
    dir,
    items
  });
}
