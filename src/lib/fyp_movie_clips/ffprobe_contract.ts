export type FfprobeStream = {
  codec_type?: string;
  codec_name?: string;
  duration?: string;
  channels?: number;
};

export type FfprobeJson = {
  streams?: FfprobeStream[];
  format?: {
    duration?: string;
    bit_rate?: string;
  };
};

export function extractAudioStream(probe: FfprobeJson): FfprobeStream | null {
  return probe.streams?.find((stream) => stream.codec_type === "audio") || null;
}

export function extractVideoDuration(probe: FfprobeJson): number {
  const value = Number(probe.format?.duration || probe.streams?.[0]?.duration || 0);
  return Number.isFinite(value) ? value : 0;
}

export function validateFfprobeHasAudio(probe: FfprobeJson): boolean {
  const audio = extractAudioStream(probe);
  return Boolean(audio?.codec_name && Number(audio.channels || 0) > 0);
}

export function buildAudioProbeFromFfprobe(probe: FfprobeJson) {
  const audio = extractAudioStream(probe);

  return {
    hasAudioTrack: validateFfprobeHasAudio(probe),
    audioCodec: audio?.codec_name || "",
    duration: extractVideoDuration(probe),
  };
}
