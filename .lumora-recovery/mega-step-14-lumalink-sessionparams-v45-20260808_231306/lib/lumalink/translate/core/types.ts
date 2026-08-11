export type LangCode =
  | 'en'
  | 'de'
  | 'fr'
  | 'es'
  | 'ar'
  | 'ur'
  | (string & { __brand?: 'LangCode' });

export type TranslationMode = 'audio_replace' | 'dual_audio' | 'captions_only';

export type ProviderKind = 'mock' | 'azure' | 'google' | 'deepgram' | 'openai' | 'aws';

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

/**
 * LumaLink Translation UI Controls (Session-level contract)
 * NOTE: Types only — UI and wiring are implemented in later steps.
 */
export type TranslationTone = 'formal' | 'neutral' | 'informal';

export type LanguageSelector = {
  /** auto-detect language from input audio/text (default true) */
  autoDetect: boolean;
  /** manual source language override when autoDetect=false */
  from?: string;
  /** target language (required when enabled) */
  to: string;
};

export type TranslationUIControls = {
  /** Left side: language control (auto-detect + from/to) */
  language: LanguageSelector;
  /** Right side: tone/style control */
  tone: TranslationTone;
};

export type TranslationSessionScope = 'message' | 'voice_call' | 'video_call';

export type TranslationSessionParams = {
  /** Must apply uniformly to messages + voice + video */
  scope: TranslationSessionScope;
  /** UI controls locked in Step 61 */
  ui: TranslationUIControls;
};

/* LUMORA_TRANSLATION_RUNTIME_COMPAT_V44 */
export type LanguageCode = LangCode;

export type SessionMode = TranslationMode | 'duplex';

export type CaptionChunk = {
  ts: number;
  lang: LanguageCode;
  text: string;
};

export type AudioChunk = {
  ts: number;
  lang: LanguageCode;
  bytes: Uint8Array;
  mime?: string;
};

export type ProviderAsrFn = (
  audio: Uint8Array,
  from: LanguageCode,
  mode: SessionMode,
) => Promise<{ text: string; lang?: LanguageCode; [key: string]: unknown }>;

export type ProviderMtFn = (
  text: string,
  from: LanguageCode,
  to: LanguageCode,
) => Promise<{ text: string; lang?: LanguageCode; [key: string]: unknown }>;

export type ProviderTtsFn = (
  text: string,
  lang: LanguageCode,
  voicePreset?: string,
) => Promise<{ bytes: Uint8Array; lang?: LanguageCode; [key: string]: unknown }>;

export type ProviderBundle = {
  asr?: ProviderAsrFn;
  mt?: ProviderMtFn;
  tts?: ProviderTtsFn;
  createASR?: (provider: string) => ProviderAsrFn;
  createMT?: (provider: string) => ProviderMtFn;
  createTTS?: (provider: string) => ProviderTtsFn;
};

export type TranslationSessionConfig = {
  enabled?: boolean;
  mode?: SessionMode;
  from?: LanguageCode;
  to?: LanguageCode;
  provider?: ProviderKind | string;
  consent?: {
    userOptIn?: boolean;
    granted?: boolean;
    [key: string]: unknown;
  };
  privacy: {
    noStorage: boolean;
    [key: string]: unknown;
  };
  captions?: {
    enabled?: boolean;
  };
  audio?: {
    enabled?: boolean;
    captionsOnly?: boolean;
  };
  latency?: {
    budgetMs?: number;
  };
  voice?: {
    preset?: string;
  };
  sessionParams?: TranslationSessionParams;
  [key: string]: unknown;
};

export type TranslationSessionHandle = {
  start: () => Promise<void>;
  stop: () => Promise<void>;
  readonly isAlive: boolean;
};

export interface CallTranslationConfig {
  tone?: TranslationTone;
}
/* LUMORA_TRANSLATION_RUNTIME_COMPAT_V44_END */
