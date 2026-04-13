import type { LumoraSignal } from "@/types/lumora.signal";

export type LumoraTrendCluster = {
  id: string;
  label: string;
  keywords: string[];
  signalIds: string[];
  regions: string[];
  languages: string[];
  platforms: string[];
  signalCount: number;
  averageVelocity: number;
  averageAttention: number;
  createdAt: number;
  updatedAt: number;
};

function normalizeToken(value: string): string {
  return value.trim().toLowerCase();
}

function chooseClusterLabel(keywords: string[]): string {
  if (!keywords.length) return "general-trend";
  return keywords.slice(0, 3).join(" · ");
}

export function clusterSignals(signals: LumoraSignal[]): LumoraTrendCluster[] {
  const input = Array.isArray(signals) ? signals : [];
  const buckets = new Map<string, LumoraSignal[]>();

  for (const signal of input) {
    const primaryKeywords = (signal.keywords || [])
      .map(normalizeToken)
      .filter(Boolean)
      .slice(0, 3);

    const key = primaryKeywords.length ? primaryKeywords.join("|") : `fallback:${signal.platform}`;
    const current = buckets.get(key) || [];
    current.push(signal);
    buckets.set(key, current);
  }

  const clusters: LumoraTrendCluster[] = Array.from(buckets.entries()).map(([key, items], index) => {
    const keywordSet = new Set<string>();
    const regionSet = new Set<string>();
    const languageSet = new Set<string>();
    const platformSet = new Set<string>();

    let velocityTotal = 0;
    let attentionTotal = 0;
    let minCreatedAt = Number.MAX_SAFE_INTEGER;
    let maxUpdatedAt = 0;

    for (const item of items) {
      (item.keywords || []).forEach((k) => keywordSet.add(normalizeToken(k)));
      if (item.region) regionSet.add(item.region);
      if (item.language) languageSet.add(item.language);
      if (item.platform) platformSet.add(item.platform);
      velocityTotal += item.velocityScore || 0;
      attentionTotal += item.attentionScore || 0;
      minCreatedAt = Math.min(minCreatedAt, item.createdAt || Date.now());
      maxUpdatedAt = Math.max(maxUpdatedAt, item.updatedAt || item.createdAt || Date.now());
    }

    const keywords = Array.from(keywordSet).filter(Boolean).slice(0, 8);

    return {
      id: `cluster_${index + 1}_${key.replace(/[^\w|.-]+/g, "_")}`,
      label: chooseClusterLabel(keywords),
      keywords,
      signalIds: items.map((item) => item.id),
      regions: Array.from(regionSet),
      languages: Array.from(languageSet),
      platforms: Array.from(platformSet),
      signalCount: items.length,
      averageVelocity: Number((velocityTotal / Math.max(1, items.length)).toFixed(2)),
      averageAttention: Number((attentionTotal / Math.max(1, items.length)).toFixed(2)),
      createdAt: minCreatedAt === Number.MAX_SAFE_INTEGER ? Date.now() : minCreatedAt,
      updatedAt: maxUpdatedAt || Date.now(),
    };
  });

  return clusters.sort((a, b) => {
    if (b.signalCount !== a.signalCount) return b.signalCount - a.signalCount;
    if (b.averageVelocity !== a.averageVelocity) return b.averageVelocity - a.averageVelocity;
    return b.averageAttention - a.averageAttention;
  });
}
