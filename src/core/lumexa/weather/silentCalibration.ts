export function detectSilentRejection(
  suggestionsIgnored: number
): boolean {
  return suggestionsIgnored >= 3;
}
