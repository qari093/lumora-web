export function normalizeRealClip(input) {
  return {
    source: String(input.source || "unknown"),
    sourceId: String(input.sourceId || input.id || ""),
    query: String(input.query || "unknown"),
    mp4Url: String(input.mp4Url || input.url || ""),
    duration: Number(input.duration || 0),
    width: Number(input.width || 0),
    height: Number(input.height || 0),
    localUrl: input.localUrl || "",
    motionScore: Number(input.motionScore ?? 0.5),
  };
}

export function createRealClipKey(clip) {
  const normalized = normalizeRealClip(clip);
  return `${normalized.source}:${normalized.sourceId}:${normalized.mp4Url}`;
}

export function dedupeRealClips(clips) {
  const seen = new Set();
  const out = [];

  for (const clip of clips.map(normalizeRealClip)) {
    const key = createRealClipKey(clip);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(clip);
  }

  return out;
}

export function passesDurationWindow(clip) {
  const duration = Number(clip.duration || 0);
  return duration >= 6 && duration <= 45;
}

export function prefersTargetDuration(clip) {
  const duration = Number(clip.duration || 0);
  return duration >= 10 && duration <= 30;
}

export function rejectStaticOrLowMotionClip(clip) {
  const motionScore = Number(clip.motionScore ?? 0.5);
  const duration = Number(clip.duration || 0);
  return motionScore >= 0.25 && duration >= 6;
}

export function filterRealIngestionCandidates(clips) {
  return dedupeRealClips(clips)
    .filter((clip) => clip.sourceId && clip.mp4Url)
    .filter(passesDurationWindow)
    .filter(rejectStaticOrLowMotionClip)
    .sort((a, b) => Number(prefersTargetDuration(b)) - Number(prefersTargetDuration(a)));
}
