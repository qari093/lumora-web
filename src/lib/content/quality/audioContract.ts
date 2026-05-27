export type AudioSignal = {
  hasAudio?: boolean;
  audioCodec?: string;
  volumeDb?: number;
  hasVoice?: boolean;
  hasMusic?: boolean;
  hasMeaningfulSound?: boolean;
};

export function isAudioPresent(signal: AudioSignal): boolean {
  return signal.hasAudio === true || Boolean(signal.audioCodec);
}

export function isAudioMeaningful(signal: AudioSignal): boolean {
  if (!isAudioPresent(signal)) return false;
  if (signal.hasMeaningfulSound === true) return true;
  if (signal.hasVoice === true) return true;
  if (signal.hasMusic === true) return true;
  if (typeof signal.volumeDb === "number") return signal.volumeDb > -45;
  return true;
}
