import type { LumoraSignal } from "@/types/lumora.signal";

export type DedupeResult = {
  totalIn: number;
  totalOut: number;
  duplicatesRemoved: number;
  signals: LumoraSignal[];
};

function canonicalText(value?: string): string {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N}\s#@-]/gu, "");
}

function buildSignalFingerprint(signal: LumoraSignal): string {
  const title = canonicalText(signal.title);
  const summary = canonicalText(signal.summary);
  const keywords = (signal.keywords || []).map(canonicalText).sort().join("|");
  const region = canonicalText(signal.region);
  const language = canonicalText(signal.language);
  return [title, summary, keywords, region, language].join("::");
}

function betterSignal(a: LumoraSignal, b: LumoraSignal): LumoraSignal {
  const aScore = (a.velocityScore || 0) + (a.attentionScore || 0) - (a.saturationScore || 0);
  const bScore = (b.velocityScore || 0) + (b.attentionScore || 0) - (b.saturationScore || 0);

  if (bScore !== aScore) return bScore > aScore ? b : a;
  if ((b.updatedAt || 0) !== (a.updatedAt || 0)) return (b.updatedAt || 0) > (a.updatedAt || 0) ? b : a;
  return a;
}

export function dedupeSignals(signals: LumoraSignal[]): DedupeResult {
  const input = Array.isArray(signals) ? signals : [];
  const byFingerprint = new Map<string, LumoraSignal>();

  for (const signal of input) {
    const key = buildSignalFingerprint(signal);
    const existing = byFingerprint.get(key);
    if (!existing) {
      byFingerprint.set(key, signal);
      continue;
    }
    byFingerprint.set(key, betterSignal(existing, signal));
  }

  const deduped = Array.from(byFingerprint.values()).sort((a, b) => {
    const scoreA = (a.velocityScore || 0) + (a.attentionScore || 0);
    const scoreB = (b.velocityScore || 0) + (b.attentionScore || 0);
    if (scoreB !== scoreA) return scoreB - scoreA;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

  return {
    totalIn: input.length,
    totalOut: deduped.length,
    duplicatesRemoved: Math.max(0, input.length - deduped.length),
    signals: deduped,
  };
}
