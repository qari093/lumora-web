import { AsrPartial, LangCode, MtPartial, StreamingASR, StreamingMT, StreamingTTS, TtsChunk } from "./types";

function silencePcm16(durationMs: number, sampleRate = 16000): Buffer {
  const samples = Math.max(1, Math.floor((durationMs / 1000) * sampleRate));
  // mono int16 => 2 bytes/sample
  return Buffer.alloc(samples * 2, 0);
}

export class MockASR implements StreamingASR {
  private cb: ((p: AsrPartial) => void) | null = null;
  private from: LangCode = "en";
  async start(opts: { from: LangCode }) { this.from = opts.from; }
  onPartial(cb: (p: AsrPartial) => void) { this.cb = cb; }
  async pushAudio(_pcm16: Buffer, tMs: number) {
    // Emit a deterministic partial; real ASR will be incremental.
    this.cb?.({ text: `(mock asr ${this.from})`, isFinal: true, tMs });
  }
  async stop() {}
}

export class MockMT implements StreamingMT {
  private cb: ((p: MtPartial) => void) | null = null;
  private to: LangCode = "de";
  async start(opts: { from: LangCode; to: LangCode }) { this.to = opts.to; }
  onPartial(cb: (p: MtPartial) => void) { this.cb = cb; }
  async pushText(p: AsrPartial) {
    this.cb?.({ text: `${p.text} -> (mock mt ${this.to})`, isFinal: p.isFinal, tMs: p.tMs });
  }
  async stop() {}
}

export class MockTTS implements StreamingTTS {
  private cb: ((c: TtsChunk) => void) | null = null;
  async start(_opts: { to: LangCode; preserveVoice: boolean }) {}
  onChunk(cb: (c: TtsChunk) => void) { this.cb = cb; }
  async pushText(p: MtPartial) {
    // 240ms silence chunk per final segment (enough to exercise playout)
    const pcm16 = silencePcm16(240);
    this.cb?.({ pcm16, durationMs: 240, tMs: p.tMs });
  }
  async stop() {}
}

import type { ProviderBundle } from "@/lib/lumalink/translate/core/types";

/**
 * Factory for deterministic mock providers used by unit tests.
 * Ensures stable tokens like:
 *  - ASR: "mock asr <lang>"
 *  - MT:  "mock mt <to>"
 *  - TTS: returns non-empty bytes
 */
export function createMockProviders(): ProviderBundle {
  // Reuse existing mocks if present; otherwise provide minimal inline mocks.
  // Prefer existing exports (mockAsr/mockMt/mockTts) when available.
  const g: any = globalThis as any;

  const asr =
    (typeof (g as any).mockAsr === "function" && (g as any).mockAsr) ||
    (async (audio: Uint8Array, lang: string) => ({
      text: `mock asr ${lang}`,
      lang,
      confidence: 0.99,
      ms: 5,
    }));

  const mt =
    (typeof (g as any).mockMt === "function" && (g as any).mockMt) ||
    (async (text: string, from: string, to: string) => ({
      text: `mock mt ${to}: ${text}`,
      lang: to,
      ms: 5,
    }));

  const tts =
    (typeof (g as any).mockTts === "function" && (g as any).mockTts) ||
    (async (text: string, lang: string) => ({
      bytes: new Uint8Array([7, 7, 7, 7, 7, 7, 7, 7]),
      lang,
      ms: 5,
      voice: "neutral",
    }));

  return { asr, mt, tts } as ProviderBundle;
}
