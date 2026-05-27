export const teaserPipelineStages = [
  "film-ingestion",
  "scene-detection",
  "audio-emotion-analysis",
  "emotional-peak-selection",
  "ffmpeg-generation",
  "webm-compression",
  "r2-upload",
  "fyp-insertion",
] as const;
