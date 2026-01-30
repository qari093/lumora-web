// CINEVERSE_RUNTIME_LOCK: do not change runtime to edge (audit step 12 cleared)
export const runtime = "nodejs";
export const preferredRegion = "auto";


import { NextRequest, NextResponse } from "next/server";

type CineVerseFypItem = {
  id: string;
  title: string;
  year?: number;
  posterUrl?: string;
  source?: string;
};

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function fallbackItems(): CineVerseFypItem[] {
  return [
    {
      id: "cineverse_fallback_001",
      title: "CineVerse (Fallback)",
      year: new Date().getUTCFullYear(),
      posterUrl: "",
      source: "fallback",
    },
  ];
}

/**
 * IMPORTANT:
 * - Avoid `import(pathExpression)` which triggers:
 *   "Critical dependency: the request of a dependency is an expression"
 * - Use only STATIC specifiers. If module doesn't exist, build will fail.
 *   So we gate by presence of an explicit env var. In audit phase, keep it off.
 */
async function loadServiceIfEnabled(): Promise<null | ((args: { limit: number }) => Promise<any>)> {
  const enabled =
    process.env.CINEVERSE_FYP_SERVICE_ENABLED === "1" ||
    process.env.LUMORA_CINEVERSE_FYP_SERVICE_ENABLED === "1";

  if (!enabled) return null;

  // Static import specifier (NO expression). If you enable this flag, ensure module exists.
  const mod: any = await import("@/services/cineverse/fyp");
  const fn =
    mod?.getCineVerseFyp ||
    mod?.getCineverseFyp ||
    mod?.cineverseFyp ||
    mod?.getFyp ||
    null;

  return typeof fn === "function" ? fn : null;
}

export async function GET(req: NextRequest) {
  const ts = Date.now();
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || "20") || 20));

  try {
    const fn = await loadServiceIfEnabled();
    if (fn) {
      const out = await fn({ limit }).catch((e: any) => ({ ok: false, error: e?.message || "service_error" }));

      if (out && typeof out === "object") {
        const items = Array.isArray(out.items)
          ? out.items
          : Array.isArray(out.data)
            ? out.data
            : Array.isArray(out.results)
              ? out.results
              : null;

        if (items) return json({ ok: out.ok !== false, items: items.slice(0, limit), ts });
        if (Array.isArray(out)) return json({ ok: true, items: out.slice(0, limit), ts });
      }
    }

    return json({ ok: false, items: fallbackItems().slice(0, limit), error: "cineverse_fyp_service_missing", ts });
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return json({ ok: false, items: fallbackItems().slice(0, limit), error: msg, ts });
  }
}
