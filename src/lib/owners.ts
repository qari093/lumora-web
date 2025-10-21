export function allowedOwners(): Set<string> {
  const raw = process.env.LUMORA_OWNER_ALLOWLIST || "OWNER_A";
  return new Set(raw.split(",").map(s => s.trim()).filter(Boolean));
}
export function isOwnerAllowed(ownerId: string | null | undefined): boolean {
  if (!ownerId) return false;
  return allowedOwners().has(ownerId);
}
