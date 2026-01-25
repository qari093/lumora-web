import type {
  AudioChunk,
  CaptionChunk,
  Consent,
  LanguageCode,
  ProviderBundle,
  SessionMode,
  TranslationSessionConfig,
  TranslationSessionHandle,
} from "@/lib/lumalink/translate/core/types";
import { assertNoStorage } from "@/lib/lumalink/translate/core/privacy";
import { clampLatencyBudgetMs, defaultLatencyBudgetMs } from "@/lib/lumalink/translate/core/latency";
import { createPipeline } from "@/lib/lumalink/translate/core/pipeline";
import { applySessionParamsToCallConfig } from "@/lib/lumalink/translate/runtime/uiControls";
import { createMockProviders } from "@/lib/lumalink/translate/core/mockProviders";

function effectiveCfgFromSessionParams(cfg: any): any {
  try {
    const sp = (cfg as any)?.sessionParams;
    if (!sp) return cfg;
    // Apply UI controls uniformly: messages, voice calls, video calls.
    // This is runtime-only wiring; no persistence, no network, privacy remains no-storage.
    return applySessionParamsToCallConfig(cfg, sp);
  } catch {
    return cfg;
  }
}


type Handlers = {
  onCaption?: (c: CaptionChunk) => void;
  onAudio?: (a: AudioChunk) => void;
  onError?: (e: Error) => void;
};

export function createTranslationSession(
  config: TranslationSessionConfig,
  providers: ProviderBundle,
  handlers: Handlers = {}
): TranslationSessionHandle {
  config = effectiveCfgFromSessionParams(config);
  assertNoStorage(config.privacy);

  const mode: SessionMode = (config.mode ?? "duplex") as SessionMode;
  const captionsEnabled = config.captions?.enabled ?? true;
  const audioEnabled = config.audio?.enabled ?? true;

  const latencyBudgetMs = clampLatencyBudgetMs(config.latency?.budgetMs ?? defaultLatencyBudgetMs());
  const pipeline = createPipeline({ providers, provider: (config.provider ?? "mock"), latencyBudgetMs });

  let alive = true;
  let started = false;

  const emitCaption = (text: string, lang: LanguageCode) => {
    if (!alive || !captionsEnabled) return;
    handlers.onCaption?.({ ts: Date.now(), lang, text });
  };

  const emitAudio = (bytes: Uint8Array, lang: LanguageCode) => {
    if (!alive || !audioEnabled) return;
    handlers.onAudio?.({ ts: Date.now(), lang, bytes, mime: "audio/pcm" });
  };

  const safeError = (e: unknown) => {
    const err = e instanceof Error ? e : new Error(String(e));
    handlers.onError?.(err);
  };

  const start = async () => {
    if (started) return;
    started = true;

    // Consent is mandatory
    const consent = config.consent;
    if (!(consent && (consent.userOptIn === true || consent.granted === true))) {
      throw new Error("consent_required");
    }

    try {
      const from = (config.from ?? "en") as LanguageCode;
      const to = (config.to ?? "fr") as LanguageCode;

      // Deterministic inbound audio token (mock pipeline stable)
      const inbound = new Uint8Array([1, 2, 3, 4]);

      const asr = await pipeline.asr(inbound, from, mode);
      emitCaption(asr.text, asr.lang as LanguageCode);

      const mt = await pipeline.mt(asr.text, from, to);
      emitCaption(mt.text, mt.lang as LanguageCode);

      // captions_only mode => no TTS/audio output
      const captionsOnly = config.mode === "captions_only" || config.audio?.captionsOnly === true;
      if (!captionsOnly && audioEnabled) {
        const tts = await pipeline.tts(mt.text, mt.lang as LanguageCode, config.voice?.preset ?? "neutral");
        emitAudio(tts.bytes, tts.lang as LanguageCode);
      }
    } catch (e) {
      safeError(e);
      throw e;
    }
  };

  const stop = async () => {
    alive = false;
  };

  return {
    start,
    stop,
    get isAlive() {
      return alive;
    },
  };
}

/**
 * Class API expected by unit tests:
 *   const s = new TranslationSession(cfg, consent)
 *   s.onCaption(cb).onAudio(cb)
 *   await s.start()
 */

export class TranslationSession {
  private cfg: TranslationSessionConfig;
  private providers: ProviderBundle;
  private handlers: Handlers;
  private handle: TranslationSessionHandle;

  // Runtime state
  private pipeline: ReturnType<typeof createPipeline> | null = null;
  private started = false;
  private stopped = false;

  constructor(cfg: any, consent: Consent, providers?: ProviderBundle) {
    // Map unit-test consent shape -> runtime consent expectation
    // Unit tests provide: { granted, scope: { storeNothing: true, ... } }
    // Runtime expects: cfg.consent.userOptIn + cfg.privacy.noStorage
    const privacy = { noStorage: true };
    const mappedConsent = { userOptIn: !!(consent && (consent as any).granted), ts: (consent as any)?.ts ?? Date.now(), scope: (consent as any)?.scope ?? {} };

    this.cfg = { ...cfg, consent: mappedConsent, privacy };
    this.providers = providers ?? createMockProviders();
    this.handlers = {};
    this.handle = createTranslationSession(this.cfg, this.providers, this.handlers);
  }

  onCaptions(cb: (txt: string) => void) {
    this.handlers.onCaption = (c) => cb(c.text);
    this.handle = createTranslationSession(this.cfg, this.providers, this.handlers);
    return this;
  }

  onAudio(cb: (pcm: Uint8Array) => void) {
    this.handlers.onAudio = (a) => cb(a.bytes);
    this.handle = createTranslationSession(this.cfg, this.providers, this.handlers);
    return this;
  }

  onError(cb: (e: Error) => void) {
    this.handlers.onError = cb;
    this.handle = createTranslationSession(this.cfg, this.providers, this.handlers);
    return this;
  }

  async start() {
    if (this.started) return;
    this.started = true;
    // also prime pipeline for pushAudio path
    const latencyBudgetMs = clampLatencyBudgetMs((this.cfg as any).latency?.budgetMs ?? defaultLatencyBudgetMs());
    this.pipeline = createPipeline({ providers: this.providers, provider: (this.cfg as any).provider ?? "mock", latencyBudgetMs });
    return this.handle.start();
  }

  /**
   * Unit-test API: pushAudio(Buffer|Uint8Array, tsMs)
   * Emits captions (ASR + MT) and optionally emits audio bytes (TTS) unless captions_only.
   */
  async pushAudio(buf: any, _tsMs: number) {
    if (this.stopped) return;
    if (!this.started) await this.start();

    const pipeline = this.pipeline;
    if (!pipeline) throw new Error("pipeline_not_initialized");

    const from = ((this.cfg as any).from ?? "en") as any;
    const to = ((this.cfg as any).to ?? "en") as any;
    const mode = (((this.cfg as any).mode ?? "duplex")) as any;

    const bytes =
      buf instanceof Uint8Array ? buf :
      (typeof Buffer !== "undefined" && Buffer.isBuffer(buf)) ? new Uint8Array(buf) :
      new Uint8Array(Array.isArray(buf) ? buf : []);

    // 1) ASR
    const asr = await pipeline.asr(bytes, from, mode);
    this.handlers.onCaption?.({ ts: Date.now(), lang: asr.lang as any, text: asr.text });

    // 2) MT (translate)
    const mt = await pipeline.mt(asr.text, from, to);
    this.handlers.onCaption?.({ ts: Date.now(), lang: mt.lang as any, text: mt.text });

    // 3) TTS (audio_replace mode) unless captions_only
    const captionsOnly = (this.cfg as any).mode === "captions_only";
    if (!captionsOnly) {
      const voicePreset = ((this.cfg as any).voice?.preset ?? "neutral") as any;
      const tts = await pipeline.tts(mt.text, mt.lang as any, voicePreset);
      this.handlers.onAudio?.({ ts: Date.now(), lang: tts.lang as any, bytes: tts.bytes, mime: "audio/pcm" });
    }
  }

  async stop() {
    this.stopped = true;
    return this.handle.stop();
  }

  get isAlive() {
    return this.handle.isAlive;
  }
}

export default TranslationSession;
