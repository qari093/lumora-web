export type PortalStatus = {
  key: string;
  label: string;
  url: string;
  ok: boolean;
  status: number;
  ms: number;
};

async function probe(url: string): Promise<{ ok: boolean; status: number; ms: number }> {
  const t0 = Date.now();
  try {
    const r = await fetch(url, { cache: "no-store" });
    const ms = Date.now() - t0;
    return { ok: r.ok, status: r.status, ms };
  } catch {
    const ms = Date.now() - t0;
    return { ok: false, status: 0, ms };
  }
}

export async function getPortalStatusGrid(): Promise<PortalStatus[]> {
  // Relative URLs (works on server components under Next.js)
  const items: Array<[string, string, string]> = [
    ["health", "Health", "/api/health"],
    ["readyz", "Ready", "/api/readyz"],
    ["portals", "Portals API", "/api/portals/health"],
    ["fyp", "FYP API", "/api/fyp/healthz"],
    ["videos", "Videos API", "/api/videos/healthz"],
    ["video", "Video API", "/api/video/health"],
    ["gmar", "GMAR API", "/api/gmar/healthz"],
    ["nexa", "NEXA API", "/api/nexa/healthz"],
    ["movies", "Movies API", "/api/movies/healthz"],
    ["music", "Music API", "/api/music/health"],
    ["live", "Live API", "/api/live/health"],
  ];

  const out: PortalStatus[] = [];
  for (const [key, label, url] of items) {
    const p = await probe(url);
    out.push({ key, label, url, ...p });
  }
  return out;
}
