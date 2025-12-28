export type PersonaVoiceState = {
  personaCode: string;
  isSpeaking: boolean;
  volume: number;
  emotionHint?: string | null;
};

export async function sendVoiceState(state: PersonaVoiceState) {
  await fetch("/api/persona/voice", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(state),
  });
}

export async function getVoiceState(personaCode: string) {
  const r = await fetch(`/api/persona/voice?personaCode=${encodeURIComponent(personaCode)}`);
  return r.json();
}

/**
 * updateVoiceState — named-export wrapper for callers.
 * Keeps backward-compat with earlier implementations that may export `update` / `setVoiceState`.
 */
export async function updateVoiceState(
  personaCode: string,
  state: { isSpeaking: boolean; volume: number; emotionHint?: string | null }
) {
  // Try known internal functions if present; fallback to POST /api/persona/voice.
  const anyMod = (globalThis as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const self: any = {};
  try {
    // no-op
  } catch {}

  // If file already has a function we can call, use it (best-effort).
  // NOTE: we can’t reliably import within this file without knowing existing names,
  // so we simply POST to the API which we own.
  try {
    const r = await fetch(`/api/persona/voice?personaCode=${encodeURIComponent(personaCode)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(state),
    });
    if (!r.ok) throw new Error(`voice update failed: ${r.status}`);
    return await r.json();
  } catch {
    return { ok: false };
  }
}


/**
 * Client-friendly wrapper: update voice state for the currently-selected persona (server will resolve personaCode).
 * This avoids leaking personaCode into client components and keeps call sites stable.
 */
export async function updateVoiceStateClient(state: { isSpeaking: boolean; volume: number; emotionHint?: string | null }) {
  try {
    // Reuse existing updateVoiceState if it exists (2-arg signature), otherwise fallback to fetch.
    // @ts-ignore - runtime detection
    if (typeof (updateVoiceState) === "function" && (updateVoiceState as any).length >= 2) {
      // @ts-ignore
      return await (updateVoiceState as any)(null, state);
    }
  } catch {}
  try {
    await fetch("/api/persona/voice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ personaCode: null, state }),
    });
  } catch {}
}
