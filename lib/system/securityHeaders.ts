export type SecuritySurfaceInput = {
  csp?: string | null;
  xFrameOptions?: string | null;
  xContentTypeOptions?: string | null;
  referrerPolicy?: string | null;
  permissionsPolicy?: string | null;
};

export type SecuritySurfaceResult =
  | {
      ok: true;
      headers: {
        "Content-Security-Policy": string;
        "X-Frame-Options": string;
        "X-Content-Type-Options": string;
        "Referrer-Policy": string;
        "Permissions-Policy": string;
      };
    }
  | { ok: false; reason: string };

const DEFAULT_CSP = "default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:;";
const ALLOWED_XFO = new Set(["DENY", "SAMEORIGIN"]);
const DEFAULT_REFERRER = "strict-origin-when-cross-origin";

export function buildSecurityHeaders(
  input: SecuritySurfaceInput
): SecuritySurfaceResult {
  const csp = typeof input.csp === "string" && input.csp.trim() ? input.csp.trim() : DEFAULT_CSP;
  const xFrameOptions =
    typeof input.xFrameOptions === "string" ? input.xFrameOptions.trim().toUpperCase() : "DENY";
  const xContentTypeOptions =
    typeof input.xContentTypeOptions === "string" ? input.xContentTypeOptions.trim() : "nosniff";
  const referrerPolicy =
    typeof input.referrerPolicy === "string" && input.referrerPolicy.trim()
      ? input.referrerPolicy.trim()
      : DEFAULT_REFERRER;
  const permissionsPolicy =
    typeof input.permissionsPolicy === "string" && input.permissionsPolicy.trim()
      ? input.permissionsPolicy.trim()
      : "camera=(), microphone=(), geolocation=()";

  if (!ALLOWED_XFO.has(xFrameOptions)) {
    return { ok: false, reason: "invalid_x_frame_options" };
  }

  if (xContentTypeOptions.toLowerCase() !== "nosniff") {
    return { ok: false, reason: "invalid_x_content_type_options" };
  }

  if (!csp.includes("default-src")) {
    return { ok: false, reason: "invalid_csp" };
  }

  return {
    ok: true,
    headers: {
      "Content-Security-Policy": csp,
      "X-Frame-Options": xFrameOptions,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": referrerPolicy,
      "Permissions-Policy": permissionsPolicy,
    },
  };
}
