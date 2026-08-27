import { NextRequest, NextResponse } from "next/server";

const QUOTE = String.fromCharCode(39);

export const LUMORA_CONTENT_SECURITY_POLICY = [
  "default-src " + QUOTE + "self" + QUOTE,
  "base-uri " + QUOTE + "self" + QUOTE,
  "object-src " + QUOTE + "none" + QUOTE,
  "frame-ancestors " + QUOTE + "none" + QUOTE,
  "form-action " + QUOTE + "self" + QUOTE + " https:",
  "img-src " + QUOTE + "self" + QUOTE + " data: blob: https:",
  "media-src " + QUOTE + "self" + QUOTE + " blob: https:",
  "font-src " + QUOTE + "self" + QUOTE + " data: https:",
  "style-src " + QUOTE + "self" + QUOTE + " " + QUOTE + "unsafe-inline" + QUOTE + " https:",
  "script-src " + QUOTE + "self" + QUOTE + " " + QUOTE + "unsafe-inline" + QUOTE + " " + QUOTE + "unsafe-eval" + QUOTE + " https:",
  "connect-src " + QUOTE + "self" + QUOTE + " https: wss:",
  "worker-src " + QUOTE + "self" + QUOTE + " blob:",
  "frame-src " + QUOTE + "self" + QUOTE + " https:",
].join("; ");

export function shouldApplyLumoraHsts(input: {
  nodeEnv?: string;
  productionSimulation?: string | null;
  enableHsts?: string | null;
}): boolean {
  if (input.nodeEnv === "production") return true;

  return (
    input.productionSimulation === "1" &&
    input.enableHsts === "1"
  );
}

export function applyLumoraSecurityHeaders(
  headers: Headers,
  options: { hsts?: boolean } = {}
): void {
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "no-referrer");
  headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=()"
  );
  headers.set(
    "content-security-policy",
    LUMORA_CONTENT_SECURITY_POLICY
  );

  if (options.hsts) {
    headers.set(
      "strict-transport-security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
}

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const requestHeaders =
    req?.headers instanceof Headers
      ? req.headers
      : new Headers();

  applyLumoraSecurityHeaders(res.headers, {
    hsts: shouldApplyLumoraHsts({
      nodeEnv: process.env.NODE_ENV,
      productionSimulation:
        requestHeaders.get("x-lumora-prod-sim"),
      enableHsts:
        requestHeaders.get("x-lumora-enable-hsts"),
    }),
  });

  res.headers.set("x-lumora-middleware", "1");

  return res;
}

export const config = {
  matcher: ["/api/nexa/:path*", "/:path*"],
};
