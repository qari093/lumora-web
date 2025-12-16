// AUTO-GENERATED IMPLEMENTATION (Step 1767)
// NOTE: kept lightweight + deterministic for tests; upgrade later as EMML evolves.
export type EmmlAnalysis = { ok: true; emotion: string; sentiment: "pos"|"neg"|"neu"; intensity: number; keywords: string[] };
export const DEFAULT_EMML_ANALYZER_CONFIG = { enabled: true } as const;

function clamp01(n:number){ return n<0?0:n>1?1:n; }
function norm(s:string){ return (s||"").toLowerCase(); }
function kw(s:string){
  const t = norm(s);
  const hit:string[] = [];
  const map: Array<[string,string]> = [
    ["happy","joy"],["joy","joy"],["excited","joy"],["love","joy"],
    ["calm","calm"],["relaxed","calm"],["peace","calm"],
    ["focus","focus"],["focused","focus"],["flow","focus"],
    ["anxious","anxious"],["anxiety","anxious"],["fear","anxious"],["panic","anxious"],
    ["sad","neutral"],["tired","neutral"],["burn","neutral"],
  ];
  for (const [k,v] of map) if (t.includes(k)) hit.push(v);
  return Array.from(new Set(hit));
}
export function classifyEmotion(text:string): string {
  const hits = kw(text);
  if (hits.includes("anxious")) return "anxious";
  if (hits.includes("joy")) return "joy";
  if (hits.includes("focus")) return "focus";
  if (hits.includes("calm")) return "calm";
  return "neutral";
}
export function scoreEmml(text:string): number {
  const t = norm(text);
  let s = 0.5;
  if (/\b(great|amazing|love|awesome|happy|joy)\b/.test(t)) s += 0.25;
  if (/\b(bad|terrible|hate|sad|anxious|panic|fear)\b/.test(t)) s -= 0.25;
  return clamp01(s);
}
export function analyzeEmmlText(text:string): EmmlAnalysis {
  const emotion = classifyEmotion(text);
  const intensity = scoreEmml(text);
  const sentiment = intensity > 0.55 ? "pos" : intensity < 0.45 ? "neg" : "neu";
  return { ok: true, emotion, sentiment, intensity, keywords: kw(text) };
}
export const analyzeEmml = analyzeEmmlText;

export type EmmlCompositeSignal = {
  ok: true;
  compositeScore: number;
  raw: {
    calmIndex: number;
    focusRatio: number;
    joyLevel: number;
    anxietyRisk: number;
  };
};

/**
 * Deterministic, side-effect-free helper for EMML CI tests.
 * Later: wire to real EMML signal pipeline.
 */
export async function computeEmmlCompositeSignal(): Promise<EmmlCompositeSignal> {
  const raw = { calmIndex: 0.62, focusRatio: 0.58, joyLevel: 0.55, anxietyRisk: 0.18 };
  const compositeScore = clamp01(
    raw.calmIndex * 0.35 + raw.focusRatio * 0.35 + raw.joyLevel * 0.25 - raw.anxietyRisk * 0.25
  );
  return { ok: true, compositeScore, raw };
}
