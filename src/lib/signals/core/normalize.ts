import type {
  LumoraSignal,
  LumoraSignalLifecycle,
  LumoraSignalTrust,
  LumoraSourcePlatform,
  LumoraEmotionTag,
} from "@/types/lumora.signal";

export type RawUnifiedSignal = {
  id?: unknown;
  platform?: unknown;
  title?: unknown;
  summary?: unknown;
  language?: unknown;
  region?: unknown;
  keywords?: unknown;
  hashtags?: unknown;
  url?: unknown;
  authorHandle?: unknown;
  trust?: unknown;
  lifecycle?: unknown;
  emotionTags?: unknown;
  velocityScore?: unknown;
  saturationScore?: unknown;
  attentionScore?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
};

const VALID_PLATFORMS: LumoraSourcePlatform[] = [
  "tiktok",
  "instagram",
  "twitter_x",
  "reddit",
  "google_trends",
  "news_rss",
  "twitch",
  "internal",
];

const VALID_TRUST: LumoraSignalTrust[] = [
  "verified",
  "low_trust",
  "toxic_velocity",
  "pending_review",
];

const VALID_LIFECYCLE: LumoraSignalLifecycle[] = [
  "rising",
  "peaking",
  "decaying",
  "archived",
];

const VALID_EMOTIONS: LumoraEmotionTag[] = [
  "curiosity",
  "humor",
  "shock",
  "tension",
  "awe",
  "anger",
  "calm",
  "nostalgia",
  "joy",
  "confusion",
];

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim());
}

function asPlatform(value: unknown): LumoraSourcePlatform {
  return VALID_PLATFORMS.includes(value as LumoraSourcePlatform)
    ? (value as LumoraSourcePlatform)
    : "internal";
}

function asTrust(value: unknown): LumoraSignalTrust {
  return VALID_TRUST.includes(value as LumoraSignalTrust)
    ? (value as LumoraSignalTrust)
    : "pending_review";
}

function asLifecycle(value: unknown): LumoraSignalLifecycle {
  return VALID_LIFECYCLE.includes(value as LumoraSignalLifecycle)
    ? (value as LumoraSignalLifecycle)
    : "rising";
}

function asEmotionTags(value: unknown): LumoraEmotionTag[] {
  if (!Array.isArray(value)) return ["curiosity"];
  const tags = value.filter((v): v is LumoraEmotionTag => VALID_EMOTIONS.includes(v as LumoraEmotionTag));
  return tags.length ? tags : ["curiosity"];
}

export function normalizeUnifiedSignal(raw: RawUnifiedSignal, index = 0): LumoraSignal | null {
  const title = asString(raw.title);
  if (!title) return null;

  const platform = asPlatform(raw.platform);
  const createdAt = asNumber(raw.createdAt, Date.now());
  const updatedAt = asNumber(raw.updatedAt, createdAt);

  return {
    id: asString(raw.id) || `${platform}_${index}_${createdAt}`,
    platform,
    title,
    summary: asString(raw.summary),
    language: asString(raw.language),
    region: asString(raw.region),
    keywords: asStringArray(raw.keywords),
    hashtags: asStringArray(raw.hashtags),
    url: asString(raw.url),
    authorHandle: asString(raw.authorHandle),
    trust: asTrust(raw.trust),
    lifecycle: asLifecycle(raw.lifecycle),
    emotionTags: asEmotionTags(raw.emotionTags),
    velocityScore: asNumber(raw.velocityScore, 0),
    saturationScore: asNumber(raw.saturationScore, 0),
    attentionScore: asNumber(raw.attentionScore, 0),
    createdAt,
    updatedAt,
  };
}

export function normalizeUnifiedSignals(rawList: RawUnifiedSignal[]): LumoraSignal[] {
  return (Array.isArray(rawList) ? rawList : [])
    .map((item, index) => normalizeUnifiedSignal(item, index))
    .filter((item): item is LumoraSignal => !!item);
}
