import { guardedJson } from "@/lib/api/guardedJson";
import { bindAudioToContent } from "@/lib/format/audio/binding";

export const dynamic = "force-dynamic";

export async function GET() {
  const binding = bindAudioToContent({
    audioId: "audio_sample_001",
    contentId: "content_sample_001",
    startMs: 0,
    volume: 0.88,
    fadeInMs: 220,
  });

  return guardedJson("api.format.audio", {
    ok: true,
    binding,
    ts: Date.now(),
  });
}
