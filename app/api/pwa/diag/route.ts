import { NextResponse } from "next/server";

export const runtime = "nodejs";

function envBool(v: string | undefined): boolean {
  return v === "1" || v === "true" || v === "yes";
}

export async function GET(req: Request) {
  try {
    const u = new URL(req.url);
    const port = u.searchParams.get("port") || "";
    const proto = u.searchParams.get("proto") || "";
    const host = req.headers.get("host") || "";
    const ua = req.headers.get("user-agent") || "";

    // conservative headers for troubleshooting; never cache
    const res = NextResponse.json(
      {
        ok: true,
        ts: Date.now(),
        host,
        proto,
        port,
        ua,
        hints: {
          a2hs: "iOS Safari → Share → Add to Home Screen",
          sw: "/sw.js",
          manifest: "/manifest.webmanifest",
          offline: "/offline.html",
          icon: "/pwa/apple-touch-icon.png",
        },
        env: {
          nodeEnv: process.env.NODE_ENV || "",
          nextPublicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
          pwa: {
            enabled: true,
            swPath: "/sw.js",
          },
          safeMode: envBool(process.env.LUMORA_SAFE_MODE) ? "on" : "off",
        },
      },
      { status: 200 }
    );
    res.headers.set("cache-control", "no-store, max-age=0");
    res.headers.set("x-lumora-pwa", "1");
    return res;
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "internal_error";
    const res = NextResponse.json({ ok: false, ts: Date.now(), error: msg }, { status: 500 });
    res.headers.set("cache-control", "no-store, max-age=0");
    res.headers.set("x-lumora-pwa", "1");
    return res;
  }
}
