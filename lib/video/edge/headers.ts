export type CacheMode = "manifest" | "segment" | "deny";

export type EdgeHeaderPolicy = Readonly<{
  vary: string;
  cacheControl: string;
  contentSecurityPolicy?: string;
  xContentTypeOptions: "nosniff";
}>;

const DEFAULT_CSP =
  "default-src 'none'; img-src 'self' data:; media-src 'self' blob:; connect-src 'self'; style-src 'self' 'unsafe-inline';";

export function buildEdgeHeaders(input: {
  mode: CacheMode;
  ttlSec: number;
  tokenHeaderName?: string; // e.g. "authorization" or "x-lumora-manifest"
  strictCsp?: boolean;
}): EdgeHeaderPolicy {
  const ttl = Number.isFinite(input.ttlSec) ? Math.max(0, Math.trunc(input.ttlSec)) : 0;
  const tokenHeader = (input.tokenHeaderName ?? "authorization").toLowerCase();

  // Vary must include token header (manifest-only auth) to avoid cache poisoning.
  const vary = `accept, ${tokenHeader}`;

  if (input.mode === "deny") {
    return {
      vary,
      cacheControl: "no-store, max-age=0",
      contentSecurityPolicy: input.strictCsp ? DEFAULT_CSP : undefined,
      xContentTypeOptions: "nosniff",
    };
  }

  // Manifest: short TTL, private, must-revalidate.
  if (input.mode === "manifest") {
    const cc = `private, max-age=${Math.min(ttl, 3600)}, must-revalidate`;
    return {
      vary,
      cacheControl: cc,
      contentSecurityPolicy: input.strictCsp ? DEFAULT_CSP : undefined,
      xContentTypeOptions: "nosniff",
    };
  }

  // Segment: can be public cache but signed url; keep short.
  const cc = `public, max-age=${Math.min(ttl, 600)}, immutable`;
  return {
    vary,
    cacheControl: cc,
    contentSecurityPolicy: input.strictCsp ? DEFAULT_CSP : undefined,
    xContentTypeOptions: "nosniff",
  };
}

export function applyHeaders(res: Response, headers: EdgeHeaderPolicy): Response {
  const h = new Headers(res.headers);
  h.set("Vary", headers.vary);
  h.set("Cache-Control", headers.cacheControl);
  h.set("X-Content-Type-Options", headers.xContentTypeOptions);
  if (headers.contentSecurityPolicy) h.set("Content-Security-Policy", headers.contentSecurityPolicy);
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}
