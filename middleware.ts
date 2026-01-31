import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// LUMORA_MW_BYPASS_STEP15 — CI stability: never rewrite/guard health + create shells
const __LUMORA_MW_BYPASS__ = new Set([
  "/api/health",
  "/api/_health",
  "/api/ready",
  "/api/version",
  "/health",
  "/ready",
  "/version",
  "/create",
]);

function __lumoraShouldBypass(pathname: string) {
  if (__LUMORA_MW_BYPASS__.has(pathname)) return true;
  if (pathname.startsWith("/create/")) return true;
  if (pathname.startsWith("/api/health") || pathname.startsWith("/api/_health") || pathname.startsWith("/api/ready") || pathname.startsWith("/api/version")) return true;
  return false;
}


function lumoraFinalize(res: any, req?: any) {
  try {
    const headers = res?.headers;
    if (headers && typeof headers.set === "function") {
      // idempotent stamp
      if (!headers.get || headers.get("x-lumora-middleware") !== "1") {
        headers.set("x-lumora-middleware", "1");
      }
    }
  } catch (_e) {}

  // IMPORTANT: do NOT recurse. applyLumoraHsts must not call lumoraFinalize.
  return applyLumoraHsts(res, req);
}

// Lumora: runtime-controlled HSTS (so tests can toggle env without restart)
// Lumora: allow tests to simulate prod-only behavior without restarting dev server.
// This ONLY affects HSTS decision when the test header is present.
function lumoraIsProdSimFromReq(req: any): boolean {
  try {
    const h = req?.headers;
    const v =
      (typeof h?.get === "function" ? h.get("x-lumora-prod-sim") : undefined) ??
      (typeof h?.["get"] === "function" ? h["get"]("x-lumora-prod-sim") : undefined) ??
      (typeof h?.["x-lumora-prod-sim"] === "string" ? h["x-lumora-prod-sim"] : undefined);
    return String(v || "").trim() === "1";
  } catch {
    return false;
  }
}

function lumoraEnableHstsFromReq(req: any): boolean {
  try {
    const h = req?.headers;
    const v =
      (typeof h?.get === "function" ? h.get("x-lumora-enable-hsts") : undefined) ??
      (typeof h?.["get"] === "function" ? h["get"]("x-lumora-enable-hsts") : undefined) ??
      (typeof h?.["x-lumora-enable-hsts"] === "string" ? h["x-lumora-enable-hsts"] : undefined);
    return String(v || "").trim() === "1";
  } catch {
    return false;
  }
}

function applyLumoraHsts(res: any, req?: any) {
  try {
    const headers = res?.headers;
    if (!headers || typeof headers.set !== "function") return res;

    const enableFromEnv = String(process.env.LUMORA_ENABLE_HSTS || "") === "1";
    const nodeProd = String(process.env.NODE_ENV || "") === "production";
    const envProdSim = String(process.env.LUMORA_TEST_PROD_SIM || "") === "1";

    const h = (k: string) => {
      try { return (req && typeof req.headers?.get === "function") ? (req.headers.get(k) || "") : ""; }
      catch { return ""; }
    };

    const prodSimFromHeader = h("x-lumora-prod-sim") === "1";
    const enableFromHeader = h("x-lumora-enable-hsts") === "1";

    const isProd = nodeProd || envProdSim || prodSimFromHeader;
    const enabled = enableFromEnv || enableFromHeader;

    if (enabled && isProd) {
      headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
  } catch (_e) {}
  return res;
}



/**
 * Minimal middleware hardening.
 * Note: next.config headers() is the primary contract enforcer; middleware is additive.
 */
export function middleware(undefined: NextRequest, req?: any) {
  try {
    const url = new URL(undefined.url);
    const pathname = url.pathname || "";
    
    // LUMORA_MW_BYPASS_STEP15 short-circuit
    if (__lumoraShouldBypass(pathname)) {
      return NextResponse.next();
    }
if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
  } catch (_e) {}

  // bypass health endpoints (Final36 Step 17) — keep health zero-cost & avoid middleware rewrite/header side-effects
  try {
    const u = new URL(req.url);
    const p = u.pathname;
    if (p === "/api/health" || p === "/api/healthz" || p === "/api/_health" || p === "/api/ready" || p === "/api/version") {
      return lumoraFinalize(applyLumoraHsts(NextResponse.next(), req), undefined);
    }
  } catch (_) {
    // if URL parsing fails, continue
  }

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("X-Frame-Options", "DENY");
  return lumoraFinalize(applyLumoraHsts(res, req), undefined);
}

export const config = {
  matcher: ["/", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
;
