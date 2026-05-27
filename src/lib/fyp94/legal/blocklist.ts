export const FYP94_UNSAFE_CONTENT_MARKERS = [
  "youtube",
  "netflix",
  "disney",
  "marvel",
  "trailer_rehost",
  "unknown_license",
  "copyrighted",
] as const;

export function isFyp94UnsafeSourceText(text: string): boolean {
  const value = text.toLowerCase();
  return FYP94_UNSAFE_CONTENT_MARKERS.some((marker) => value.includes(marker));
}
