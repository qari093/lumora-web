export type RawSourceClip = {
  id: string;
  title?: string;
  source: string;
  license: string;
  sourceUrl?: string;
  creator?: string;
  playableUrl?: string;
  localUrl?: string;
  embedUrl?: string;
  mimeType?: string;
  hasAudio?: boolean;
  durationSeconds?: number;
};

export type PipelineResult = {
  accepted: RawSourceClip[];
  rejected: { item: RawSourceClip; reasons: string[] }[];
};
