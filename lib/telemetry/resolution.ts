export type ResolutionDistItem = {
  label: string;
  count: number;
  bytes: number;
};

type Entry = { label: string; bytes: number };

const g = globalThis as any;
const KEY = "__LUMORA_RESOLUTION_ENTRIES__";

function getStore(): Entry[] {
  if (!Array.isArray(g[KEY])) g[KEY] = [];
  return g[KEY] as Entry[];
}

export function resetResolutionForTest() {
  g[KEY] = [];
}

function toHeightPFromWxH(s: string): string | null {
  const m = s.match(/^(\d{2,5})\s*[xX]\s*(\d{2,5})$/);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0) return null;
  return `${h}p`;
}

function normalizeLabel(raw: string): string {
  const s = (raw || "").trim().toLowerCase();
  if (!s) return "unknown";
  const fromWxH = toHeightPFromWxH(s);
  if (fromWxH) return fromWxH;

  const numeric = s.match(/^(\d{3,4})$/);
  if (numeric) return `${Number(numeric[1])}p`;

  const hp = s.match(/^(\d{3,4})p$/);
  if (hp) return `${Number(hp[1])}p`;

  // Accept known aliases
  if (s === "hd") return "720p";
  if (s === "fhd") return "1080p";
  if (s === "uhd" || s === "4k") return "2160p";

  return s;
}

export function recordResolutionCappedUsage(args: {
  requestedLabel: string;
  enforcedHeight?: number;
  wasCapped: boolean;
  bytes: number;
}) {
  const bytes = Number.isFinite(args.bytes) && args.bytes > 0 ? args.bytes : 0;
  const store = getStore();

  // Always record requested bucket (telemetry may be "disabled" elsewhere; this is local in-memory only)
  const requested = normalizeLabel(args.requestedLabel);
  store.push({ label: `requested:${requested}`, bytes });

  // Record enforced bucket when capped (or when explicitly provided)
  if (args.wasCapped && Number.isFinite(args.enforcedHeight) && (args.enforcedHeight as number) > 0) {
    store.push({ label: `enforced:${normalizeLabel(String(args.enforcedHeight) + "p")}`, bytes });
  }
}

export function getResolutionDistribution(limit = 50): ResolutionDistItem[] {
  const store = getStore();
  const map = new Map<string, { count: number; bytes: number }>();

  for (const e of store) {
    const k = e.label;
    const cur = map.get(k) || { count: 0, bytes: 0 };
    cur.count += 1;
    cur.bytes += e.bytes;
    map.set(k, cur);
  }

  const out: ResolutionDistItem[] = Array.from(map.entries()).map(([label, v]) => ({
    label,
    count: v.count,
    bytes: v.bytes,
  }));

  out.sort((a, b) => b.bytes - a.bytes || b.count - a.count || a.label.localeCompare(b.label));
  return out.slice(0, Math.max(1, limit));
}

export function recordResolutionUsage(label: string, bytes: number) {
  const safeBytes = Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
  getStore().push({
    label: normalizeLabel(label),
    bytes: safeBytes,
  });
}
