"use client";

export type PersonaVoiceState = {
  isSpeaking: boolean;
  volume: number; // 0..1
  emotionHint?: string | null;
  updatedAt?: string | null;
};

export async function getVoiceState(personaCode: string) {
  const q = new URLSearchParams({ personaCode });
  const r = await fetch(`/api/persona/voice?${q.toString()}`, { cache: "no-store" });
  if (!r.ok) return { ok: false as const, state: null as any };
  return (await r.json()) as { ok: boolean; state: PersonaVoiceState | null };
}

export async function updateVoiceState(personaCode: string, state: Omit<PersonaVoiceState, "updatedAt">) {
  const r = await fetch(`/api/persona/voice`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ personaCode, state }),
  });
  if (!r.ok) return { ok: false as const };
  return (await r.json()) as { ok: boolean };
}
