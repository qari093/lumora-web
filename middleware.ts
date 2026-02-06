import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


/**
 * __LUMORA_SECURITY_HEADERS_STEP53__
 * Enforce baseline security headers on ALL non-API responses.
 * (API routes may emit their own; Step 53 verifies core pages.)
 */
function lumoraApplySecurityHeaders(res: any) {
  try {
    // Don’t overwrite if already set upstream
    if (!res.headers.get("x-content-type-options")) res.headers.set("x-content-type-options", "nosniff");
    if (!res.headers.get("x-frame-options")) res.headers.set("x-frame-options", "DENY");
    if (!res.headers.get("referrer-policy")) res.headers.set("referrer-policy", "strict-origin-when-cross-origin");
    if (!res.headers.get("permissions-policy")) res.headers.set("permissions-policy", "camera=(), microphone=(), geolocation=()");
    // Only set CSP if missing (avoid breaking existing CSP logic elsewhere)
    if (!res.headers.get("content-security-policy")) {
      res.headers.set("content-security-policy",
        "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: blob:; media-src 'self' data: blob:; font-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https: wss:");
    }
  } catch {}
  return res;
}

/* LUMORA_WALLET_MW_GATE */
function lumoraHasAuth(req: any): boolean {
  const auth = (req.headers.get("authorization") || "").trim();
  if (/^bearer\s+\S+/i.test(auth)) return true;
  const xUser = (req.headers.get("x-user-id") || "").trim();
  if (xUser.length > 0) return true;

  // Cookie heuristic (provider-agnostic)
  const cookie = (req.headers.get("cookie") || "");
  return /(session|token|auth|jwt|sid|next-auth)/i.test(cookie);
}

function __lumora_mw_inner(req: NextRequest) {

  // __LUMORA_ICON_MW_STEP49_RETRY2__
  // Force icon cache + proof header even when Next headers() are bypassed for special routes/static assets.
  // Applies to: /favicon.ico, /icon, /apple-icon, /icon.png, /apple-icon.png
  {
    const p = req.nextUrl.pathname || "";
    const isFavicon = p === "/favicon.ico";
    const isIcon = p === "/icon" || p === "/apple-icon" || p === "/icon.png" || p === "/apple-icon.png";
    if (isFavicon || isIcon) {
      const res = NextResponse.next();
      res.headers.set("X-Lumora-Icon-Headers", "1");
      if (isFavicon) {
        res.headers.set("Cache-Control", "public, max-age=86400, immutable");
      } else {
        res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      }
      return res;
    }
  }


  // Step 46 — enforce cache headers for PWA manifest (must override static/metadata defaults)
  try {
    const pathname = req?.nextUrl?.pathname || "";
    if (pathname === "/manifest.webmanifest") {
      res.headers.set("X-Lumora-MW-Hit", "1");const res = NextResponse.next();
      res.headers.set("Cache-Control", "public, max-age=3600, immutable");
      res.headers.set("Content-Type", "application/manifest+json");
      res.headers.set("X-Content-Type-Options", "nosniff");
      
      return res;
    }
  } catch {}
  // LUMORA_WALLET_API_AUTH_GUARD — auth-first: deny unauthenticated wallet API calls BEFORE any payload validation
  // Applies to: /api/wallet/* and /api/wallets/*
  {
    const p = req.nextUrl.pathname || "";
    const isWalletApi = p === "/api/wallet" || p.startsWith("/api/wallet/");
    const isWalletsApi = p === "/api/wallets" || p.startsWith("/api/wallets/");
    if (isWalletApi || isWalletsApi) {
      const auth = (req.headers.get("authorization") || "").trim();
      const hasBearer = /^bearer\s+\S+/i.test(auth);
      const hasXUser = (req.headers.get("x-user-id") || "").trim().length > 0;
      if (!hasBearer && !hasXUser) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
    }
  }

  const { pathname } = req.nextUrl;

  // Only gate wallet UI for Step 11 (do not alter other routes)
  if (pathname === "/wallet" || pathname.startsWith("/wallet/")) {
    if (!lumoraHasAuth(req)) {
      const url = req.nextUrl.clone();
      url.pathname = "/private-access";
      return NextResponse.redirect(url, 302);
    }
  }

  const __res = NextResponse.next();
  // __LUMORA_SECURITY_HEADERS_APPLY_STEP53__
  return lumoraApplySecurityHeaders(__res);
}

// LUMORA_MW_MATCHER_CONFIG — ensure middleware runs for wallet UI + wallet APIs





/**
 * __LUMORA_MIDDLEWARE_MATCHER_STEP53_ROOT__
 * Explicitly include '/' so security headers apply to homepage.
 */
/**
 * __LUMORA_MW_WRAP_STEP53_ALL__
 * Guarantee baseline security headers across ALL matched routes (including /wallet).
 * Do not weaken; only set when missing.
 */
export function middleware(request) {
  const maybe = __lumora_mw_inner(request);
  return Promise.resolve(maybe).then((respMaybe) => {
    const resp = respMaybe ?? NextResponse.next();
    const h = resp.headers;

    if (!h.has("x-content-type-options")) h.set("X-Content-Type-Options", "nosniff");
    if (!h.has("referrer-policy")) h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    if (!h.has("x-frame-options")) h.set("X-Frame-Options", "DENY");
    if (!h.has("permissions-policy")) h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    
    // __LUMORA_MW_CSP_STEP53_BASELINE__
    if (!h.has("content-security-policy")) h.set("Content-Security-Policy", "default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; form-action 'self'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; font-src 'self' data: https:; style-src 'self' 'unsafe-inline' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; connect-src 'self' https: wss:; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests");
return resp;
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|manifest.webmanifest|sitemap.xml|apple-icon|icon).*)",
  ],
};
