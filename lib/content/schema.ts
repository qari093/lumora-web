export type LumoraContentSignal = {
  id: string;
  title?: string;
  score?: number;
  mood?: string;
  tags?: string[];
};

export function normalizeContentSignal(input: Partial<LumoraContentSignal> = {}): LumoraContentSignal {
  return {
    id: input.id || "content_signal",
    title: input.title || "Lumora Signal",
    score: typeof input.score === "number" ? input.score : 0,
    mood: input.mood || "neutral",
    tags: Array.isArray(input.tags) ? input.tags : []
  };
}

export function assertContentSignal(input: Partial<LumoraContentSignal> = {}) {
  const signal = normalizeContentSignal(input);
  return Boolean(signal.id);
}
