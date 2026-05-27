export function buildFinalSystemReport(feed: any[]) {
  const total = feed.length;

  const audioCount = feed.filter((x) => x.hasAudio).length;
  const audioRatio = total ? audioCount / total : 0;

  const diversity = new Set(feed.map((x) => x.query)).size;

  return {
    total,
    audioRatio,
    diversity,
    ready: total > 300 && diversity > 5 && audioRatio >= 0.3,
  };
}
