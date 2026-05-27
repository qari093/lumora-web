export function computeHumanScore(item: any): number {
  const text = `${item.title || ""} ${item.description || ""} ${item.query || ""}`.toLowerCase();

  let score = 0;

  if (text.includes("crowd")) score += 0.3;
  if (text.includes("people")) score += 0.2;
  if (text.includes("kids")) score += 0.3;
  if (text.includes("family")) score += 0.25;
  if (text.includes("street")) score += 0.2;
  if (text.includes("reaction")) score += 0.3;
  if (text.includes("event")) score += 0.2;

  return Math.min(score, 1);
}

export function boostHumanTags(item: any): any {
  const score = computeHumanScore(item);
  return { ...item, humanScore: score };
}

export function downrankEnvironmental(item: any): any {
  const text = `${item.title || ""}`.toLowerCase();

  if (
    text.includes("mountain") ||
    text.includes("ocean") ||
    text.includes("landscape")
  ) {
    return { ...item, humanScore: 0 };
  }

  return item;
}

export function detectEventDensity(item: any): number {
  const duration = Number(item.duration || 0);
  const score = computeHumanScore(item);

  if (duration > 0 && score > 0) {
    return Math.min((score * duration) / 30, 1);
  }

  return 0;
}

export function attachHumanSignals(item: any) {
  const base = boostHumanTags(item);
  const adjusted = downrankEnvironmental(base);

  return {
    ...adjusted,
    eventDensity: detectEventDensity(adjusted),
  };
}
