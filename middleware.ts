import { NextRequest, NextResponse } from "next/server";
import { reqId } from "./src/lib/reqid";

// CORS allow-list helpers (host-only match, no port)
function hostnameFromOrigin(origin: string | null): string | null {
  if (!origin) return null;
  try { return new URL(origin).hostname.toLowerCase(); } catch { return null; }
}
function allowedPublishers(): Set<string> {
  const raw = process.env.LUMORA_PUBLISHER_ALLOWLIST || "localhost,127.0.0.1";
  return new Set(
    raw.split(",")
       .map(s => s.trim().toLowerCase())
       .map(h => h.replace(/:\d+$/, ""))
       .filter(Boolean)
  );
}
function isAllowedOrigin(origin: string | null): { ok: boolean; origin?: string } {
  const host = hostnameFromOrigin(origin);
  if (!host) return { ok: false };
  return { ok: allowedPublishers().has(host), origin };
}

const MATCH = ["/api/", "/embed", "/p.gif", "/r", "/ads/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!MATCH.some(p => pathname.startsWith(p))) return NextResponse.next();

  const origin = req.headers.get("origin");
  const verdict = isAllowedOrigin(origin);

  // Create base response we will return/modify
  const respond = (res: NextResponse) => {
    // Observability: request id
    const id = req.headers.get("x-request-id") || reqId();
    res.headers.set("x-request-id", id);

    // Security headers
    res.headers.set("x-content-type-options", "nosniff");
    res.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    res.headers.set("permissions-policy",
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=()");
    res.headers.set("x-frame-options", "DENY");

    // CORS passthrough (if origin is allowlisted)
    if (verdict.ok) {
      res.headers.set("access-control-allow-origin", verdict.origin!);
      res.headers.set("access-control-allow-methods", "GET,POST,OPTIONS,HEAD");
      res.headers.set("access-control-allow-headers", "content-type,x-request-id");
      res.headers.append("vary", "origin");
    }
    return res;
  };

  // Preflight
  if (req.method === "OPTIONS") {
    if (!verdict.ok) {
      return respond(new NextResponse(JSON.stringify({ ok:false, error:"CORS_FORBIDDEN" }), {
        status: 403,
        headers: { "content-type": "application/json; charset=utf-8", "vary": "origin" },
      }));
    }
    return respond(new NextResponse(null, {
      status: 204,
      headers: { "access-control-max-age": "600" },
    }));
  }

  // Normal flow
  return respond(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
