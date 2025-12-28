import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

function safeReadDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function isAssetFile(name: string) {
  const n = name.toLowerCase();
  return n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".webp") || n.endsWith(".svg");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") || "avatar").toLowerCase(); // avatar|emoji
  const emotion = (searchParams.get("emotion") || "neutral").toLowerCase(); // for avatars
  const reaction = (searchParams.get("reaction") || "love").toLowerCase(); // for emojis

  const root = process.cwd();
  let diskDir = "";
  let webBase = "";

  if (type === "emoji") {
    diskDir = path.join(root, "public", "persona", "emojis", reaction);
    webBase = `/persona/emojis/${reaction}`;
  } else {
    diskDir = path.join(root, "public", "persona", "avatars", emotion);
    webBase = `/persona/avatars/${emotion}`;
  }

  const files = safeReadDir(diskDir)
    .filter(isAssetFile)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 600);

  const items = files.map((f) => ({
    file: f,
    url: `${webBase}/${encodeURIComponent(f)}`,
  }));

  return NextResponse.json({
    ok: true,
    type,
    emotion,
    reaction,
    count: items.length,
    dir: diskDir,
    items,
  });
}
