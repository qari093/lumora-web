export type LangCode =
  | "en" | "de" | "fr" | "es" | "ar" | "ur"
  | (string & { __brand?: "LangCode" });

export type TranslationMode = "audio_replace" | "dual_audio" | "captions_only";

export type ProviderKind = "mock" | "azure" | "google" | "deepgram" | "openai" | "aws";

export interface Consent {
  /** User explicitly opted in for this call/session. */
  granted: boolean;
  /** Timestamp when consent was granted (ms since epoch). */
  ts: number;
  /** Scope: voice only, video captions, etc. */
  scope: {
    voice: boolean;
    captions: boolean;
    storeNothing: true;
  };
}

export interface CallTranslationConfig {
  enabled: boolean;
  mode: TranslationMode;
  from: LangCode;
  to: LangCode;
  provider: ProviderKind;
  /** Hard latency cap in ms; pipeline must degrade gracefully under this. */
  maxEndToEndLatencyMs: number;
  /** If true, attempt voice identity preservation; if false, generic voice. */
  preserveVoice: boolean;
}

export interface AsrPartial {
  text: string;
  isFinal: boolean;
  /** Monotonic timestamp in ms relative to session start. */
  tMs: number;
}

export interface MtPartial {
  text: string;
  isFinal: boolean;
  tMs: number;
}

export interface TtsChunk {
  /** PCM16 mono audio (little-endian). */
  pcm16: Buffer;
  /** Duration in ms represented by this chunk. */
  durationMs: number;
  /** Monotonic timestamp in ms relative to session start. */
  tMs: number;
}

export interface StreamingASR {
  start(opts: { from: LangCode }): Promise<void>;
  pushAudio(pcm16: Buffer, tMs: number): Promise<void>;
  onPartial(cb: (p: AsrPartial) => void): void;
  stop(): Promise<void>;
}

export interface StreamingMT {
  start(opts: { from: LangCode; to: LangCode }): Promise<void>;
  pushText(p: AsrPartial): Promise<void>;
  onPartial(cb: (p: MtPartial) => void): void;
  stop(): Promise<void>;
}

export interface StreamingTTS {
  start(opts: { to: LangCode; preserveVoice: boolean }): Promise<void>;
  pushText(p: MtPartial): Promise<void>;
  onChunk(cb: (c: TtsChunk) => void): void;
  stop(): Promise<void>;
}

export interface TranslationPipeline {
  start(): Promise<void>;
  pushAudio(pcm16: Buffer, tMs: number): Promise<void>;
  onCaptions(cb: (txt: string, tMs: number, isFinal: boolean) => void): void;
  onAudio(cb: (pcm16: Buffer, tMs: number) => void): void;
  stop(): Promise<void>;
}
