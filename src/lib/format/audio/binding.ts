export type AudioBinding = {
  audioId: string;
  contentId: string;
  startMs: number;
  volume: number;
  fadeInMs: number;
};

export function bindAudioToContent(input: {
  audioId: string;
  contentId: string;
  startMs?: number;
  volume?: number;
  fadeInMs?: number;
}): AudioBinding {
  return {
    audioId: input.audioId,
    contentId: input.contentId,
    startMs: input.startMs ?? 0,
    volume: input.volume ?? 0.9,
    fadeInMs: input.fadeInMs ?? 180,
  };
}
