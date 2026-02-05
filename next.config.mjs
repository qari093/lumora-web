/* eslint-env node */
/* eslint-disable no-undef */
import base from "./next.config.base.mjs"
/**
 * Final36 Security Overlay
 * - Adds baseline security headers + CSP without relying on brittle string edits
 * - Preserves any existing base.headers() output by appending an additional global rule
 */
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "media-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' https: wss:",
].join("; ");

const BASELINE = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: CSP },
];

let nextConfig = {
  ...base,
  async headers() {
    const existing =
      typeof base?.headers === "function" ? await base.headers() : [];
    const arr = Array.isArray(existing) ? existing : [];
    // Append a global rule to guarantee CSP/headers are present.
    arr.push({
      source: "/:path*",
      headers: BASELINE,
    });
    return arr;
  },
};


/* FINAL36_HSTS_PROD_ONLY */
const __final36_orig_headers = nextConfig.headers;
nextConfig.headers = async () => {
  const rules = __final36_orig_headers ? await __final36_orig_headers() : [];
  const enable = process.env.LUMORA_ENABLE_HSTS === "1";
  if (!enable) return rules;
  const hsts = { key: "Strict-Transport-Security", value: "max-age=15552000; includeSubDomains" };
  return (rules || []).map((r) => ({
    ...r,
    headers: Array.isArray(r.headers) ? [...r.headers, hsts] : [hsts],
  }));
};


// __LUMORA_MANIFEST_HEADERS_WRAP_V7__
// Force-prepend manifest headers regardless of how headers() is implemented.
// This avoids brittle AST injection into an existing headers() body.
const __lumoraManifestRule = {
  source: "/manifest.webmanifest",
  headers: [
    { key: "Cache-Control", value: "public, max-age=3600, immutable" },
    { key: "X-Lumora-Manifest-Headers", value: "1" },
  ],
};

const __lumoraPrevHeaders = nextConfig && (nextConfig.headers || nextConfig.headers);
nextConfig = nextConfig || {};
nextConfig.headers = async () => {
  let prev = [];
  try {
    prev = typeof __lumoraPrevHeaders === "function" ? await __lumoraPrevHeaders() : [];
  } catch {
    prev = [];
  }
  if (!Array.isArray(prev)) prev = [];
  prev = prev.filter((r) => !(r && r.source === "/manifest.webmanifest"));
  return [__lumoraManifestRule, ...prev];
};

export default nextConfig;
