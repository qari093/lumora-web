export type SourceClip = {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  license: "pd" | "cc0" | "cc-by";
  attribution?: string;
  hasAudio: boolean;
  duration?: number;
  source: string;
};
