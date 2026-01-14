import base from "./next.config.base.mjs";

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

export default {
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
