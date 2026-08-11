import type {
  LanguageCode,
  ProviderBundle,
  SessionMode,
} from '@/lib/lumalink/translate/core/types';
import { createMockProviders } from '@/lib/lumalink/translate/core/mockProviders';

/**
 * Normalized pipeline interface used by runtime/session.ts.
 * Must always provide callable functions: asr, mt, tts.
 */
export type Pipeline = {
  asr: (
    audio: Uint8Array,
    from: LanguageCode,
    mode: SessionMode,
  ) => Promise<{ text: string; lang: LanguageCode }>;
  mt: (
    text: string,
    from: LanguageCode,
    to: LanguageCode,
  ) => Promise<{ text: string; lang: LanguageCode }>;
  tts: (
    text: string,
    lang: LanguageCode,
    voicePreset: string,
  ) => Promise<{ bytes: Uint8Array; lang: LanguageCode }>;
};

type CreatePipelineArgs = {
  providers: ProviderBundle;
  provider?: string;
  latencyBudgetMs?: number;
  nowMs?: () => number;
};

/**
 * ProviderBundle can evolve. This adapter makes runtime stable:
 * - If bundle exposes factories (createASR/createMT/createTTS) use them.
 * - Else if bundle exposes direct funcs (asr/mt/tts) use them.
 * - Else fallback to mock providers.
 */
export function createPipeline(args: CreatePipelineArgs): Pipeline {
  const providerId = (args.provider ?? 'mock') as any;

  const base = args && args.providers ? args.providers : (createMockProviders() as any);

  const hasFactories =
    base &&
    typeof base.createASR === 'function' &&
    typeof base.createMT === 'function' &&
    typeof base.createTTS === 'function';

  const hasDirect =
    base &&
    typeof base.asr === 'function' &&
    typeof base.mt === 'function' &&
    typeof base.tts === 'function';

  let asrFn: Pipeline['asr'] | undefined;
  let mtFn: Pipeline['mt'] | undefined;
  let ttsFn: Pipeline['tts'] | undefined;

  if (hasFactories) {
    try {
      asrFn = base.createASR(providerId);
      mtFn = base.createMT(providerId);
      ttsFn = base.createTTS(providerId);
    } catch {
      // fallback below
    }
  }

  if ((!asrFn || !mtFn || !ttsFn) && hasDirect) {
    asrFn = base.asr;
    mtFn = base.mt;
    ttsFn = base.tts;
  }

  if (typeof asrFn !== 'function' || typeof mtFn !== 'function' || typeof ttsFn !== 'function') {
    const mock = createMockProviders() as any;
    if (typeof mock.createASR === 'function') {
      asrFn = mock.createASR('mock');
      mtFn = mock.createMT('mock');
      ttsFn = mock.createTTS('mock');
    } else {
      asrFn = mock.asr;
      mtFn = mock.mt;
      ttsFn = mock.tts;
    }
  }

  if (typeof asrFn !== 'function') throw new Error('pipeline_asr_missing');
  if (typeof mtFn !== 'function') throw new Error('pipeline_mt_missing');
  if (typeof ttsFn !== 'function') throw new Error('pipeline_tts_missing');

  return {
    asr: async (audio, from, mode) => {
      const r = await asrFn(audio, from, mode);
      return { text: String(r?.text ?? ''), lang: (r?.lang ?? from) as any };
    },
    mt: async (text, from, to) => {
      const r = await mtFn(text, from, to);
      return { text: String(r?.text ?? ''), lang: (r?.lang ?? to) as any };
    },
    tts: async (text, lang, voicePreset) => {
      const r = await ttsFn(text, lang, voicePreset);
      const bytes = r?.bytes instanceof Uint8Array ? r.bytes : new Uint8Array(r?.bytes ?? []);
      return { bytes, lang: (r?.lang ?? lang) as any };
    },
  };
}
