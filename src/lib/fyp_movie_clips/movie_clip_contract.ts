import { buildLicenseProof } from "./license_guard";
import { shouldRejectSilentMovieClip, isValidMovieClipDuration, type MovieAudioProbe } from "./audio_guard";

export type SafeMovieClipInput = {
  id: string;
  title: string;
  sourceId: string;
  sourceUrl: string;
  license: string;
  duration: number;
  audio: MovieAudioProbe;
};

export function validateSafeMovieClip(input: SafeMovieClipInput) {
  const licenseProof = buildLicenseProof({
    sourceId: input.sourceId,
    sourceUrl: input.sourceUrl,
    license: input.license,
  });

  const audioOk = !shouldRejectSilentMovieClip(input.audio);
  const durationOk = isValidMovieClipDuration(input.duration);

  return {
    ok: licenseProof.safe && audioOk && durationOk,
    licenseProof,
    audioOk,
    durationOk,
    reasons: [
      !licenseProof.safe ? "unsafe_license" : "",
      !audioOk ? "missing_or_silent_audio" : "",
      !durationOk ? "invalid_duration" : "",
    ].filter(Boolean),
  };
}
