import { guardedJson } from "@/lib/api/guardedJson";
import { moderateAudioTranscriptBatch, type AudioTranscriptInput } from "@/lib/safety/audio/transcriptModeration";

export const dynamic = "force-dynamic";

export async function GET() {
  const sample: AudioTranscriptInput[] = [
    {
      assetId: "safe_audio_sample",
      transcript: "This is an official trailer voiceover with cinematic narration.",
      durationMs: 120000,
      language: "en",
      source: "cineverse",
    },
    {
      assetId: "risky_audio_sample",
      transcript: "explicit violent kill sequence leaked audio",
      durationMs: 90000,
      language: "en",
      source: "unknown",
    },
  ];

  const results = moderateAudioTranscriptBatch(sample);

  return guardedJson("api.safety.audio-transcript", {
    ok: true,
    checked: results.length,
    blocked: results.filter((r) => r.action === "block").length,
    review: results.filter((r) => r.action === "review").length,
    results,
    ts: Date.now(),
  });
}
