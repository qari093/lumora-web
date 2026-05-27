export function reviewSponsorCompatibility(input: {
  brandName: string;
  copy: string;
  constellationAtmosphere: string;
}): boolean {
  const copy = input.copy.toLowerCase();
  if (copy.includes("buy reach") || copy.includes("guaranteed") || copy.includes("casino")) return false;
  if (!input.brandName.trim()) return false;
  return input.constellationAtmosphere.trim().length > 0;
}
