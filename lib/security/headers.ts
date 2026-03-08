export type HeaderBag = Record<string, string>;

export function securityHeaders(): HeaderBag {
  // Safe baseline for a PWA/SPA + API:
  // - Avoid breaking inline styles/scripts in early phase (no CSP here; add later with report-only ramp).
  // - Keep nosniff, frame-ancestors equivalent, referrer policy, permissions policy.
  return {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "DENY",
    // Minimal Permissions-Policy; expand as features mature.
    "Permissions-Policy": [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "payment=()",
      "usb=()",
      "interest-cohort=()",
    ].join(", "),
    // Cross-origin isolation is disruptive; defer.
    // HSTS only meaningful on HTTPS; still safe to set when deployed behind TLS.
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };
}

export function applySecurityHeaders(h: Headers): void {
  const s = securityHeaders();
  for (const [k, v] of Object.entries(s)) h.set(k, v);
}
