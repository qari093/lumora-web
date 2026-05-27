import { SourceClip } from "./types";

export async function ingestStock(): Promise<SourceClip[]> {
  return [{
    id: "pexels_demo",
    title: "Stock Clip",
    videoUrl: "https://pexels.com/demo.mp4",
    license: "cc0",
    hasAudio: false,
    source: "Pexels"
  }];
}
