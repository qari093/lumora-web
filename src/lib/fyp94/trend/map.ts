import type { Fyp94TrendInput, Fyp94TrendMappedQuery } from "./types";

function inferStyleLabel(text: string): Fyp94TrendMappedQuery["styleLabel"] {
  const value = text.toLowerCase();

  if (/(funny|comedy|cat|dog|meme)/.test(value)) return "comedy";
  if (/(travel|city|beach|mountain)/.test(value)) return "travel";
  if (/(fail|stunt|pov|speed|jump|crash|adrenaline)/.test(value)) return "adrenaline";
  if (/(sport|football|surf|skate|bike)/.test(value)) return "sports";

  return "cinematic";
}

export function mapFyp94TrendToLegalQuery(trend: Fyp94TrendInput): Fyp94TrendMappedQuery {
  const base = [...trend.keywords, trend.category].filter(Boolean).join(" ").trim();

  return {
    trendId: trend.id,
    query: base || trend.title,
    category: trend.category,
    caption: `Trending now: ${trend.title}`,
    styleLabel: inferStyleLabel(`${trend.title} ${base}`),
  };
}
