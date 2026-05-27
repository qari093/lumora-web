export function attachMemoryPhrase(input: {
  held?: number;
  returned?: number;
}) {
  const parts = [];
  if (input.held) parts.push(`${input.held} held`);
  if (input.returned) parts.push(`${input.returned} returned`);
  return parts.length ? parts.join(", ") : "A quiet trace remained";
}
