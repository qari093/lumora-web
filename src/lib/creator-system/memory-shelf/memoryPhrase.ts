export function buildMemoryPhrase(input: {
  held: number;
  returned: number;
  present?: number;
  still?: number;
}): string {
  const parts = [
    input.present ? `${input.present} present` : "",
    input.still ? `${input.still} still` : "",
    input.held ? `${input.held} held` : "",
    input.returned ? `${input.returned} returned` : "",
  ].filter(Boolean);

  return parts.join(", ") || "A quiet trace remained";
}
