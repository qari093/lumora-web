export function validatePage(p: any) {
  return { ok: !!p?.url && p.countsHidden === true };
}
