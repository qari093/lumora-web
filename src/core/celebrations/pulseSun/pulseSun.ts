export function resolvePulseSunHue(type: string): string {
  if (type === "birthday") return "gold";
  if (type === "memorial") return "silver";
  return "neutral";
}
