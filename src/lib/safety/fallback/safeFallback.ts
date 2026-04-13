export type SafeFallbackItem = {
  id: string;
  type: "video" | "image" | "text";
  title: string;
  description: string;
  category: string;
  safe: true;
};

export type SafeFallbackResponse = {
  ok: boolean;
  count: number;
  items: SafeFallbackItem[];
  ts: number;
};

const SAFE_FALLBACK_CONTENT: SafeFallbackItem[] = [
  {
    id: "fallback_001",
    type: "video",
    title: "Nature Calm Sequence",
    description: "Safe cinematic nature visuals with relaxing motion",
    category: "calm",
    safe: true,
  },
  {
    id: "fallback_002",
    type: "image",
    title: "Minimal Art Frame",
    description: "Neutral aesthetic visual placeholder",
    category: "art",
    safe: true,
  },
  {
    id: "fallback_003",
    type: "text",
    title: "Stay Tuned",
    description: "Content is being processed. Enjoy curated safe visuals.",
    category: "system",
    safe: true,
  },
];

export function getSafeFallbackContent(limit = 3): SafeFallbackResponse {
  const items = SAFE_FALLBACK_CONTENT.slice(0, Math.max(1, Math.min(limit, SAFE_FALLBACK_CONTENT.length)));

  return {
    ok: true,
    count: items.length,
    items,
    ts: Date.now(),
  };
}
