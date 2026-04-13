export type MotionPreview = {
  id: string;
  provider: "internal" | "giphy" | "tenor" | "youtube_embed";
  previewType: "gif" | "short_loop" | "poster_motion";
  url: string;
};

export function getMotionPreviewProvider(): MotionPreview {
  return {
    id: "preview_sample_001",
    provider: "internal",
    previewType: "poster_motion",
    url: "/static/previews/sample-motion-preview.webp"
  };
}
