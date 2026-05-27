import { runFfprobe } from "./ffprobe_runner";
import { buildAudioProbeFromFfprobe } from "../ffprobe_contract";
import fs from "node:fs";

export function validateDownloadedMovieAudio(filePath: string): boolean {
  const probe = runFfprobe(filePath);
  if (!probe) return false;

  const audio = buildAudioProbeFromFfprobe(probe);

  if (!audio.hasAudioTrack) {
    try { fs.unlinkSync(filePath); } catch {}
    return false;
  }

  return true;
}
