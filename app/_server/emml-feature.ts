export function isEmmlEnabled(): boolean {
  const v = process.env.EMML_ENABLED;
  if (v === undefined || v === null) return true;
  const s = String(v).trim().toLowerCase();
  if (s === "" ) return true;
  const truthy = new Set(["1","true","t","yes","y","on","enabled"]);
  return truthy.has(s);
}

export function emmlDisableReason(): string | null {
  return isEmmlEnabled() ? null : "EMML_DISABLED_BY_ENV";
}
