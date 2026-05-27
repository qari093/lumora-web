import { isAudioMeaningful, type AudioSignal } from "./audioContract";
import { validatePlayability, type PlayabilityInput } from "./playability";

export type SourceClipQualityInput = AudioSignal &
  PlayabilityInput & {
    id: string;
    title?: string;
    source?: string;
    license?: string;
  };

export function validateSourceClipQuality(input: SourceClipQualityInput) {
  const audioOk = isAudioMeaningful(input);
  const playback = validatePlayability(input);

  return {
    ok: audioOk && playback.ok,
    audioOk,
    playbackOk: playback.ok,
    reasons: [
      !audioOk ? "missing_or_meaningless_audio" : "",
      ...playback.reasons,
    ].filter(Boolean),
  };
}

export function filterPlayableAudioClips<T extends SourceClipQualityInput>(items: T[]): T[] {
  return items.filter((item) => validateSourceClipQuality(item).ok);
}
