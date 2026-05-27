export const REQUIRED_MONETIZATION_PACK_LOCKS = Array.from({ length: 25 }, (_, i) =>
  `.lumora_monetization_pack${String(i + 1).padStart(2, "0")}_lock`
);

export function validatePackLocks(existingLocks: string[]) {
  const missing = REQUIRED_MONETIZATION_PACK_LOCKS.filter((lock) => !existingLocks.includes(lock));

  return {
    ok: missing.length === 0,
    missing,
    totalRequired: REQUIRED_MONETIZATION_PACK_LOCKS.length,
  };
}
