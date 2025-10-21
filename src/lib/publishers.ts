function cleanHost(x?: string | null): string | null {
  if (!x) return null;
  try {
    // Accept raw host ("site.com") or full URL ("https://site.com/page")
    if (/^[a-z]+:\/\//i.test(x)) return new URL(x).host.toLowerCase();
    return x.toLowerCase().replace(/^[.]+/, "");
  } catch { return null; }
}

/** Allowed publishers from env (comma-separated hosts). Default: localhost & 127.0.0.1 */
export function allowedPublishers(): Set<string> {
  const raw = process.env.LUMORA_PUBLISHER_ALLOWLIST || "localhost,127.0.0.1";
  return new Set(
    raw.split(",").map(s => cleanHost(s.trim()))
       .filter((v): v is string => !!v)
  );
}

/** Try to extract publisher host from query param `pub` or Referer header */
export function getPublisherHostFrom(req: Request): string | null {
  try {
    const url = new URL(req.url);
    const qsPub = url.searchParams.get("pub");
    const cand = cleanHost(qsPub);
    if (cand) return cand;
  } catch {}
  try {
    const h = (req as any).headers ?? new Headers();
    const ref = h.get?.("referer") || (h instanceof Headers ? h.get("referer") : null);
    if (ref) return cleanHost(ref);
  } catch {}
  return null;
}

export function isPublisherAllowed(host: string | null | undefined): boolean {
  if (!host) return false;
  return allowedPublishers().has(host);
}
