import { PrismaClient } from "@prisma/client";

/**
 * Best-effort EMML seeding for tests.
 * Strategy:
 *  1) If DB already has EMML data, return { seeded: true }.
 *  2) Attempt to call an existing app seed utility (if present) via dynamic import.
 *  3) Re-check DB; if still empty, return { seeded: false } so tests can skip deterministically.
 */
export async function ensureEmmlSeed(): Promise<{ seeded: boolean; reason?: string }> {
  const db = new PrismaClient();

  async function counts() {
    const [idx, mkt, ast, tick] = await Promise.all([
      (db as any).emmlIndex?.count?.().catch(() => 0) ?? 0,
      (db as any).emmlMarket?.count?.().catch(() => 0) ?? 0,
      (db as any).emmlAsset?.count?.().catch(() => 0) ?? 0,
      (db as any).emmlTick?.count?.().catch(() => 0) ?? 0,
    ]);
    return { idx, mkt, ast, tick };
  }

  try {
    const c0 = await counts();
    if (c0.idx > 0 && c0.mkt > 0 && c0.ast > 0 && c0.tick > 0) {
      return { seeded: true };
    }

    // Try a set of likely seed utility modules / functions.
    const candidates: Array<{ mod: string; fns: string[] }> = [
      { mod: "../app/emml/seed", fns: ["seedEmml", "seed", "ensureSeed", "seedDemo", "seedEmmlDemo"] },
      { mod: "../app/_lib/emml/seed", fns: ["seedEmml", "seed", "ensureSeed", "seedDemo", "seedEmmlDemo"] },
      { mod: "../app/_lib/emml/seedDemo", fns: ["seedEmmlDemo", "seedDemo", "seed"] },
      { mod: "../app/_lib/emml/demoSeed", fns: ["seedEmmlDemo", "seedDemo", "seed"] },
      { mod: "../app/_lib/emml", fns: ["seedEmml", "seedEmmlDemo", "seedDemo"] },
      { mod: "../app/_lib/emml/index", fns: ["seedEmml", "seedEmmlDemo", "seedDemo"] },
      { mod: "../app/api/emml/seed/route", fns: ["POST", "GET"] },
    ];

    let invoked = false;
    for (const c of candidates) {
      try {
        const m: any = await import(c.mod);
        for (const fnName of c.fns) {
          const fn = m?.[fnName];
          if (typeof fn === "function") {
            // If it's a Next route handler, call it without req (handlers should tolerate).
            if (fnName === "GET" || fnName === "POST") {
              await fn(new Request("http://127.0.0.1/api/emml/seed", { method: fnName }));
            } else {
              await fn();
            }
            invoked = true;
            break;
          }
        }
        if (invoked) break;
      } catch {
        // ignore
      }
    }

    const c1 = await counts();
    if (c1.idx > 0 && c1.mkt > 0 && c1.ast > 0 && c1.tick > 0) {
      return { seeded: true };
    }

    return {
      seeded: false,
      reason: invoked
        ? "seed_util_ran_but_db_still_empty"
        : "no_seed_util_found_and_db_empty",
    };
  } finally {
    await db.$disconnect().catch(() => {});
  }
}
