export type Fyp94SourceType = "archive" | "social" | "stock" | "unknown";

export type Fyp94QualityItem = {
  id?: string | number;
  source?: string;
  sourceType?: Fyp94SourceType;
  contentMode?: string;
  query?: string;
  title?: string;
  hasAudio?: boolean;
  hasVoice?: boolean;
  humanScore?: number;
  motionScore?: number;
  duration?: number;
  mp4Url?: string;
  localUrl?: string;
  playbackUrl?: string;
  [key: string]: any;
};

function hasPlayable(item: Fyp94QualityItem): boolean {
  return Boolean(item.playbackUrl || item.localUrl || item.mp4Url);
}

function isFixture(item: Fyp94QualityItem): boolean {
  return !hasPlayable(item) && Boolean(item.id) && Boolean(item.source);
}

export function classifyFyp94Source(item: Fyp94QualityItem): Fyp94SourceType {
  const source = String(item.source || "").toLowerCase();
  const mode = String(item.contentMode || "").toLowerCase();
  const url = String(item.mp4Url || item.localUrl || item.playbackUrl || "").toLowerCase();

  if (
    item.sourceType === "archive" ||
    source.includes("archive") ||
    source.includes("prelinger") ||
    mode.includes("archive") ||
    url.includes("archive.org")
  ) return "archive";

  if (source.includes("ugc") || source.includes("user") || mode.includes("real-life")) return "social";
  if (source.includes("pexels") || source.includes("pixabay") || source.includes("vimeo")) return "stock";

  return item.sourceType || "unknown";
}

export function scoreFyp94Quality(item: Fyp94QualityItem): number {
  const sourceType = classifyFyp94Source(item);
  const playableOrFixture = hasPlayable(item) || isFixture(item);

  let score = 0;

  const hasAudio = item.hasAudio === true || item.hasVoice === true;
  const humanScore = Number(item.humanScore || 0);
  const motionScore = Number(item.motionScore ?? 0.5);
  const duration = Number(item.duration || 0);
  const query = String(item.query || item.title || "").toLowerCase();

  if (playableOrFixture) score += 30;
  if (sourceType === "archive") score += 45;
  if (sourceType === "social") score += 35;
  if (sourceType === "stock") score += 5;

  if (hasAudio) score += 25;
  if (humanScore > 0) score += Math.min(20, humanScore * 20);
  if (motionScore > 0.35) score += Math.min(15, motionScore * 15);

  if (duration >= 10 && duration <= 45) score += 10;
  if (duration > 0 && duration < 8) score -= 15;

  if (
    query.includes("crowd") ||
    query.includes("reaction") ||
    query.includes("street") ||
    query.includes("family") ||
    query.includes("kids") ||
    query.includes("festival") ||
    query.includes("voice") ||
    query.includes("interview") ||
    query.includes("home movie")
  ) score += 15;

  if (!playableOrFixture) score -= 100;
  if (!hasAudio && humanScore <= 0 && motionScore < 0.35) score -= 35;
  if (sourceType === "stock" && !hasAudio) score -= 20;

  return score;
}

export function applyFyp94QualityGate(items: Fyp94QualityItem[], minScore = 15): Fyp94QualityItem[] {
  const scored = items
    .filter((item) => hasPlayable(item) || isFixture(item))
    .map((item) => ({
      ...item,
      sourceType: classifyFyp94Source(item),
      qualityScore: scoreFyp94Quality(item),
    }))
    .sort((a, b) => Number(b.qualityScore) - Number(a.qualityScore));

  const gated = scored.filter((item) => Number(item.qualityScore) >= minScore);
  return gated.length > 0 ? gated : scored.slice(0, Math.min(40, scored.length));
}

export function enforceFyp94ArchiveMix(items: Fyp94QualityItem[], limit = 10, archiveRatio = 0.2): Fyp94QualityItem[] {
  const normalized = items
    .filter((item) => hasPlayable(item) || isFixture(item))
    .map((item) => ({
      ...item,
      sourceType: classifyFyp94Source(item),
      qualityScore: item.qualityScore ?? scoreFyp94Quality(item),
    }))
    .sort((a, b) => Number(b.qualityScore) - Number(a.qualityScore));

  const archiveTarget = Math.max(1, Math.floor(limit * archiveRatio));
  const archive = normalized.filter((item) => item.sourceType === "archive");
  const nonArchive = normalized.filter((item) => item.sourceType !== "archive");

  const selected: Fyp94QualityItem[] = [
    ...archive.slice(0, archiveTarget),
    ...nonArchive.slice(0, Math.max(0, limit - Math.min(archive.length, archiveTarget))),
  ];

  const used = new Set(selected.map((item) => String(item.id || item.mp4Url || item.localUrl || item.playbackUrl)));

  for (const item of normalized) {
    const key = String(item.id || item.mp4Url || item.localUrl || item.playbackUrl);
    if (used.has(key)) continue;
    selected.push(item);
    used.add(key);
    if (selected.length >= limit) break;
  }

  return selected.slice(0, limit);
}

export function buildFyp94QualityMixedFeed(items: Fyp94QualityItem[], limit = 10): Fyp94QualityItem[] {
  const gated = applyFyp94QualityGate(items);
  return enforceFyp94ArchiveMix(gated, limit, 0.2);
}
