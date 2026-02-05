import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

export function middleware(req: NextRequest) {

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

  return NextResponse.next();
}

// LUMORA_MW_MATCHER_CONFIG — ensure middleware runs for wallet UI + wallet APIs
export const config = {
  matcher: ["/manifest.webmanifest", "/wallet", "/wallet/:path*", "/api/wallet/:path*", "/api/wallets/:path*"],
}

