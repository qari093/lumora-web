import type { GeneratedWhisper, WhisperEvent } from "./types";
import { isWhisperCopySafe, softenWhisper } from "./whisperSafety";

function template(event: WhisperEvent): string {
  const at = typeof event.timestampSeconds === "number" ? ` at ${formatTimestamp(event.timestampSeconds)}` : "";

  switch (event.signal) {
    case "rewatch_peak":
      return `People replayed a quiet moment${at} more than usual.`;
    case "silent_linger":
      return `Viewers lingered longer during your softer silence${at}.`;
    case "completion_rhythm":
      return "Your pacing held people gently until the end.";
    case "save_overlap":
      return "People quietly saved this work more often than expected.";
    case "tone_softening":
      return `Your tone softened${at}, and people stayed with it.`;
    case "quiet_return":
      return "Some viewers returned quietly, without needing to react publicly.";
    default:
      return "Your work created a small moment of resonance.";
  }
}

export function formatTimestamp(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function generateWhispers(events: readonly WhisperEvent[], creativeIntensity = false): GeneratedWhisper[] {
  const max = creativeIntensity ? 3 : 1;

  return [...events]
    .filter((event) => event.sampleSize >= 3 && event.strength >= 0.35)
    .sort((a, b) => b.strength * b.sampleSize - a.strength * a.sampleSize)
    .slice(0, max)
    .map((event, index) => {
      const text = softenWhisper(template(event));
      return {
        id: `whisper_${event.signal}_${event.videoId}_${index}`,
        text,
        signal: event.signal,
        videoId: event.videoId,
        timestampSeconds: event.timestampSeconds,
        priority: Math.round(event.strength * 100),
        safe: isWhisperCopySafe(text)
      };
    })
    .filter((item) => item.safe);
}
