export function validateWitnessName(name: string) {
  const v = name.trim();
  if (v.length < 2) return false;
  if (v.length > 24) return false;
  if (!/^[a-zA-Z][a-zA-Z0-9 ._-]*$/.test(v)) return false;
  return true;
}
