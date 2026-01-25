export type AsrChunk = {
  tsMs: number;
  lang: string;
  text: string;
  isFinal: boolean;
};

export type MtChunk = {
  tsMs: number;
  srcLang: string;
  dstLang: string;
  text: string;
  isFinal: boolean;
};

export type TtsChunk = {
  tsMs: number;
  lang: string;
  // Raw audio bytes in an agreed codec (implementation-specific)
  audio: Uint8Array;
  isFinal: boolean;
};

export type TranslationConsent = {
  callId: string;
  userId: string;
  // explicit user confirmation required
  acceptedAtMs: number;
  // participant languages for the call
  fromLang: string;
  toLang: string;
  mode: "captions" | "dual-audio" | "replace-audio";
  // enforce: no storage
  noStorage: true;
};

export interface StreamingASR {
  start(input: AsyncIterable<Uint8Array>, opts: { lang: string }): AsyncIterable<AsrChunk>;
}

export interface StreamingMT {
  translate(input: AsyncIterable<AsrChunk>, opts: { dstLang: string }): AsyncIterable<MtChunk>;
}

export interface StreamingTTS {
  synthesize(input: AsyncIterable<MtChunk>, opts: { voiceId?: string; lang: string }): AsyncIterable<TtsChunk>;
}
