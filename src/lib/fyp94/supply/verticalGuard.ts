import type { Fyp94RawSupplyClip } from "./contracts";

export function isFyp94VerticalClip(clip: Pick<Fyp94RawSupplyClip, "width" | "height">): boolean {
  return typeof clip.width === "number" && typeof clip.height === "number" && clip.height > clip.width;
}

export function isFyp94Mp4Clip(clip: Pick<Fyp94RawSupplyClip, "mp4Url">): boolean {
  return /\.mp4($|\?)/i.test(clip.mp4Url);
}

export function isFyp94DurationSafe(clip: Pick<Fyp94RawSupplyClip, "durationSeconds">): boolean {
  return typeof clip.durationSeconds === "number" && clip.durationSeconds >= 7 && clip.durationSeconds <= 45;
}

export function filterFyp94VerticalMp4SupplyClips(clips: Fyp94RawSupplyClip[]): Fyp94RawSupplyClip[] {
  return clips.filter((clip) => isFyp94VerticalClip(clip) && isFyp94Mp4Clip(clip) && isFyp94DurationSafe(clip));
}
