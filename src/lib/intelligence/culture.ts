import type { LumoraSignal } from "@/types/lumora.signal";

export type CulturalAnnotatedSignal = LumoraSignal & {
  culturalTags: string[];
  cultureReason: string;
};

const CULTURE_RULES: Array<{ tag: string; keywords: string[] }> = [
  { tag: "movies", keywords: ["trailer", "movie", "cinema", "box office", "director", "cast"] },
  { tag: "music", keywords: ["album", "song", "track", "artist", "concert", "lyrics"] },
  { tag: "gaming", keywords: ["game", "gaming", "twitch", "esports", "patch", "speedrun"] },
  { tag: "sports", keywords: ["match", "goal", "final", "league", "player", "tournament"] },
  { tag: "tech", keywords: ["ai", "chip", "startup", "device", "app", "launch", "software"] },
  { tag: "fashion", keywords: ["fashion", "runway", "style", "outfit", "designer", "beauty"] },
  { tag: "news", keywords: ["breaking", "policy", "election", "crisis", "update", "report"] },
  { tag: "culture", keywords: ["festival", "tradition", "community", "viral", "trend", "remix"] },
  { tag: "food", keywords: ["recipe", "food", "dish", "restaurant", "chef", "cooking"] },
  { tag: "travel", keywords: ["travel", "trip", "city", "beach", "flight", "tourism"] },
];

function blob(signal: LumoraSignal): string {
  return [
    signal.title,
    signal.summary,
    ...(signal.keywords || []),
    ...(signal.hashtags || []),
    signal.region || "",
    signal.language || "",
  ]
    .join(" ")
    .toLowerCase();
}

export function deriveCulturalTags(signal: LumoraSignal): { tags: string[]; reason: string } {
  const text = blob(signal);
  const matched = CULTURE_RULES
    .filter((rule) => rule.keywords.some((k) => text.includes(k)))
    .map((rule) => rule.tag);

  const tags = Array.from(new Set(matched)).slice(0, 4);
  return {
    tags: tags.length ? tags : ["general"],
    reason: tags.length ? "keyword_rule_match" : "fallback_general",
  };
}

export function annotateCulture(signal: LumoraSignal): CulturalAnnotatedSignal {
  const derived = deriveCulturalTags(signal);
  return {
    ...signal,
    culturalTags: derived.tags,
    cultureReason: derived.reason,
  };
}

export function annotateCultureBatch(signals: LumoraSignal[]): CulturalAnnotatedSignal[] {
  return (Array.isArray(signals) ? signals : []).map(annotateCulture);
}
