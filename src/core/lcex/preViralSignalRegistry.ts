export type PreViralSignalType =
  | "search-intent"
  | "conversation-heat"
  | "fandom-ignition"
  | "quote-repetition"
  | "visual-motif"
  | "soundtrack-heat"
  | "entity-spike"
  | "regional-ignition";

export type PreViralSignal = {
  id: string;
  type: PreViralSignalType;
  entityId: string;
  category: "movie" | "series" | "music" | "gaming" | "cross-media";
  source: string;
  score: number;
  confidence: number;
  detectedAt: string;
  region?: string;
  language?: string;
  metadata?: Record<string, string | number | boolean>;
};

export const PRE_VIRAL_SIGNAL_REGISTRY: PreViralSignal[] = [];

export function registerPreViralSignal(signal: PreViralSignal): void {
  PRE_VIRAL_SIGNAL_REGISTRY.push(signal);
}

export function getPreViralSignalsByEntity(entityId: string): PreViralSignal[] {
  return PRE_VIRAL_SIGNAL_REGISTRY.filter((signal) => signal.entityId === entityId);
}

export function getTopPreViralSignals(limit = 20): PreViralSignal[] {
  return [...PRE_VIRAL_SIGNAL_REGISTRY]
    .sort((a, b) => {
      const scoreDelta = b.score - a.score;
      if (scoreDelta !== 0) return scoreDelta;
      return b.confidence - a.confidence;
    })
    .slice(0, limit);
}
