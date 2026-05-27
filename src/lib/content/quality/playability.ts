export type PlayabilityInput = {
  playableUrl?: string;
  localUrl?: string;
  embedUrl?: string;
  mimeType?: string;
  durationSeconds?: number;
};

export function validatePlayability(input: PlayabilityInput) {
  const playable = Boolean(input.playableUrl || input.localUrl || input.embedUrl);
  const type = String(input.mimeType || "video/mp4").toLowerCase();
  const supported =
    type.includes("video/mp4") ||
    type.includes("video/webm") ||
    type.includes("application/x-mpegurl") ||
    type.includes("text/html");

  const duration = Number(input.durationSeconds || 0);
  const durationOk = duration === 0 || (duration >= 6 && duration <= 240);

  return {
    ok: playable && supported && durationOk,
    reasons: [
      !playable ? "missing_playable_media" : "",
      !supported ? "unsupported_media_type" : "",
      !durationOk ? "invalid_duration" : "",
    ].filter(Boolean),
  };
}
