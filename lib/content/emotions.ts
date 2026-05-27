export function attachEmotionTags<T extends Record<string, any>>(item: T): T & { emotionTags: string[] } {
  const tags = Array.isArray(item.tags) ? item.tags.map(String) : [];
  return {
    ...item,
    emotionTags: tags.length ? tags : ["neutral"],
  };
}
