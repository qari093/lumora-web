import { productionDebugGate } from "@/src/lib/runtime-guards/productionDebugGate";
import { NextRequest, NextResponse } from "next/server";

function boolParam(v: string | null): boolean | null {
  if (v === null) return null;
  if (v === "1" || v === "true" || v === "yes") return true;
  if (v === "0" || v === "false" || v === "no") return false;
  return null;
}

export async function GET(req: NextRequest) {
  const blocked = productionDebugGate();
  if (blocked) return blocked;
  try {
    const url = new URL(req.url);

    const port = url.searchParams.get("port") || "";
    const ua = req.headers.get("user-agent") || "";
    const host = req.headers.get("host") || "";
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.headers.get("cf-connecting-ip") ||
      "";
    const proto = req.headers.get("x-forwarded-proto") || "";

    // Client-reported (the only reliable way to confirm iOS standalone / display-mode)
    const clientStandalone = boolParam(url.searchParams.get("clientStandalone"));
    const clientDisplayMode = url.searchParams.get("clientDisplayMode"); // "standalone" | "browser" | "minimal-ui" | etc
    const clientNavigatorStandalone = boolParam(
      url.searchParams.get("clientNavigatorStandalone")
    );

    const out = {
      ok: true,
      ts: Date.now(),
      port,
      host,
      ip,
      proto,
      ua,
      // Server-side hint only (NOT a standalone proof)
      iosHint: /iPhone|iPad|iPod/i.test(ua),
      // Client-side truth (when provided by /pwa/diag page)
      client: {
        standalone: clientStandalone,
        displayMode: clientDisplayMode || null,
        navigatorStandalone: clientNavigatorStandalone,
      },
      note:
        "For iOS standalone proof, open /pwa/diag from the Home Screen app; it reports display-mode + navigator.standalone to this API.",
    };

    const res = NextResponse.json(out, { status: 200 });
    res.headers.set("x-lumora-pwa", "1");
    res.headers.set("cache-control", "no-store, max-age=0");
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    return NextResponse.json({ ok: false, error: msg, ts: Date.now() }, { status: 500 });
  }
}
