import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const AVATAR_ROOT = path.join(PUBLIC_DIR, "persona", "avatars");
const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "focused"];
const EXTS = [".svg", ".png", ".webp"];

function resolveVariant(emotion: string, code: string): string | null {
  for (const ext of EXTS) {
    const full = path.join(AVATAR_ROOT, emotion, `${code}${ext}`);
    if (fs.existsSync(full)) return `/persona/avatars/${emotion}/${code}${ext}`;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim();

  if (!/^avatar_\d{3}$/.test(code)) {
    return NextResponse.json(
      { ok: false, error: "BAD_CODE", message: "code must be avatar_001..avatar_120" },
      { status: 400 }
    );
  }

  const variants: Record<string, string> = {};
  for (const emotion of EMOTIONS) {
    const found = resolveVariant(emotion, code);
    if (found) variants[emotion] = found;
  }

  return NextResponse.json({
    ok: true,
    code,
    variants
  });
}
