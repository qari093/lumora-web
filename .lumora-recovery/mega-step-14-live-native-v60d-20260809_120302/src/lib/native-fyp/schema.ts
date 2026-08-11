export type NativeFypVideoInput = {
  id?: string;
  title?: string;
  sourceType?: string;
  source?: string;
  rightsStatus?: string;
  licenseType?: string;
  playbackUrl?: string;
  localUrl?: string;
  mp4Url?: string;
  posterUrl?: string;
  durationSeconds?: number;
  duration?: number;
  createdAt?: string;
};

export type NativeFypVideo = {
  id: string;
  title: string;
  sourceType: string;
  rightsStatus: 'verified' | string;
  licenseType: string;
  playbackUrl: string;
  posterUrl: string;
  durationSeconds: number;
  createdAt: string;

  source?: string;
  localUrl?: string;
  mp4Url?: string;
  duration?: number;
};

export type NativeFypVideoValidation = { ok: true } | { ok: false; reason: string };

export function validateNativeFypVideo(input: NativeFypVideoInput): NativeFypVideoValidation {
  const sourceType = String(input.sourceType ?? input.source ?? '').toLowerCase();
  const playbackUrl = String(input.playbackUrl ?? input.localUrl ?? input.mp4Url ?? '');
  const posterUrl = String(input.posterUrl ?? '');
  const durationSeconds = Number(input.durationSeconds ?? input.duration ?? 0);

  const prohibited = new Set(['youtube_iframe', 'youtube', 'yt', 'unknown_rights', 'unknown', '']);
  if (prohibited.has(sourceType)) return { ok: false, reason: 'prohibited-source' };
  if (!playbackUrl || !playbackUrl.toLowerCase().includes('.mp4'))
    return { ok: false, reason: 'invalid-playback-url' };
  if (!posterUrl) return { ok: false, reason: 'missing-poster' };
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0 || durationSeconds > 180) {
    return { ok: false, reason: 'invalid-duration' };
  }

  return { ok: true };
}
