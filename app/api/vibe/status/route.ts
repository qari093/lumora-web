import { NextResponse } from "next/server";
import { vibeTagsLiteEnabled } from "@/lib/flags/vibeTags";

function json(data: any, status = 200) {
  return NextResponse.json({ ...data, ts: Date.now() }, { status });
}

function pickEnv(key: string): string | null {
  const v = process.env[key];
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length ? s : null;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug") === "1";

    const enabled = !!vibeTagsLiteEnabled();

    const out: any = {
      ok: true,
      enabled,
      source: "flags:vibeTagsLiteEnabled",
    };

    if (debug) {
      out.env = {
        LUMORA_VIBE_TAGS_LITE: pickEnv("LUMORA_VIBE_TAGS_LITE"),
        NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE: pickEnv("NEXT_PUBLIC_LUMORA_VIBE_TAGS_LITE"),
      };
      out.nodeEnv = pickEnv("NODE_ENV");
    }

    return json(out, 200);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    // never 500 in dev/tests for a status endpoint; keep it inspectable
    return json({ ok: true, enabled: false, source: "error_fallback", error: msg }, 200);
  }
}
