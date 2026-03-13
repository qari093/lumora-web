import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const EMOTIONS = ["neutral", "happy", "sad", "angry", "surprised", "focused", "calm"] as const;
const DEFAULT_CODE = "avatar_001";
const VALID_RE = /^avatar_(0\d\d|1[0-1]\d|120)$/;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Lumora-Sec": "1",
    },
  });
}

function resolveCode(raw: string | null): string {
  const value = (raw ?? "").trim();
  return VALID_RE.test(value) ? value : DEFAULT_CODE;
}

function publicVariantPath(emotion: string, code: string) {
  return `/persona/avatars/${emotion}/${code}.png`;
}

function diskVariantPath(emotion: string, code: string) {
  return path.join(process.cwd(), "public", "persona", "avatars", emotion, `${code}.png`);
}

export async function GET(req: NextRequest) {
  try {
    const code = resolveCode(req.nextUrl.searchParams.get("code"));

    const variants = EMOTIONS.map((emotion) => {
      const file = diskVariantPath(emotion, code);
      return {
        emotion,
        code,
        path: publicVariantPath(emotion, code),
        exists: fs.existsSync(file),
      };
    });

    return json({
      ok: true,
      code,
      fallbackApplied: code === DEFAULT_CODE && !VALID_RE.test((req.nextUrl.searchParams.get("code") ?? "").trim()),
      variants,
      count: variants.length,
      emotions: [...EMOTIONS],
      ts: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "internal_error";
    return json({ ok: false, error: message }, 500);
  }
}
