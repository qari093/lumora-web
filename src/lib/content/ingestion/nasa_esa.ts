import { SourceClip } from "./types";

export async function ingestNasa(): Promise<SourceClip[]> {
  return [{
    id: "nasa_demo",
    title: "NASA Space Clip",
    videoUrl: "https://images-assets.nasa.gov/video/demo.mp4",
    license: "pd",
    hasAudio: true,
    source: "NASA"
  }];
}

export async function ingestEsa(): Promise<SourceClip[]> {
  return [{
    id: "esa_demo",
    title: "ESA Space Clip",
    videoUrl: "https://esa.int/demo.mp4",
    license: "cc-by",
    attribution: "ESA",
    hasAudio: true,
    source: "ESA"
  }];
}
