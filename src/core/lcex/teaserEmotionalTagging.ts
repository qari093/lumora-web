export type TeaserEmotionTag =
  | "hype"
  | "mystery"
  | "intense"
  | "epic"
  | "fun"
  | "romantic"
  | "dark"
  | "calm"
  | "nostalgic"
  | "unknown";

export type EmotionTaggedTeaser = {
  id: string;
  title?: string;
  subtitle?: string;
  sourceHints?: string[];
};

function normalize(value?: string): string {
  return (value || "").trim().toLowerCase();
}

export function inferTeaserEmotionTags(
  input: EmotionTaggedTeaser
): TeaserEmotionTag[] {
  const haystack = [
    normalize(input.title),
    normalize(input.subtitle),
    ...(input.sourceHints || []).map(normalize),
  ].join(" ");

  const tags = new Set<TeaserEmotionTag>();

  if (/(hype|drop|launch|premiere|reveal)/.test(haystack)) tags.add("hype");
  if (/(mystery|secret|unknown|tease)/.test(haystack)) tags.add("mystery");
  if (/(intense|thrill|explosive|violent)/.test(haystack)) tags.add("intense");
  if (/(epic|legend|saga|grand)/.test(haystack)) tags.add("epic");
  if (/(fun|comedy|playful|light)/.test(haystack)) tags.add("fun");
  if (/(love|romance|heart)/.test(haystack)) tags.add("romantic");
  if (/(dark|horror|grim|shadow)/.test(haystack)) tags.add("dark");
  if (/(calm|soft|gentle|ambient)/.test(haystack)) tags.add("calm");
  if (/(nostalgia|retro|throwback|classic)/.test(haystack)) tags.add("nostalgic");

  return tags.size > 0 ? [...tags] : ["unknown"];
}

export function attachTeaserEmotionTags<T extends EmotionTaggedTeaser>(
  input: T
): T & { emotionTags: TeaserEmotionTag[] } {
  return {
    ...input,
    emotionTags: inferTeaserEmotionTags(input),
  };
}
