import { prisma } from "@/lib/db";

/** Extract a best-effort client IP (supports test override via x-test-ip) */
export function getClientIp(req: Request): string {
  const h = (name: string) => req.headers.get(name) || "";
  const test = h("x-test-ip").trim();
  if (test) return test;
  const xff = h("x-forwarded-for").split(",")[0].trim();
  if (xff) return xff;
  return "127.0.0.1";
}

export async function isIpBlocked(ip: string): Promise<boolean> {
  if (!ip) return false;
  const row = await prisma.ipBlock.findUnique({ where: { ip } });
  if (!row) return false;
  if (!row.expiresAt) return true;
  return row.expiresAt.getTime() > Date.now();
}

/** Increment counter in a sliding window and return true if over limit. */
export async function bumpAndOverLimit(key: string, limit: number, windowSec: number): Promise<boolean> {
  const now = new Date();
  const kc = await prisma.keyCounter.findUnique({ where: { key } });
  if (!kc) {
    await prisma.keyCounter.create({ data: { key, count: 1, windowStart: now } });
    return false;
  }
  const windowStart = kc.windowStart.getTime();
  if (now.getTime() - windowStart > windowSec * 1000) {
    await prisma.keyCounter.update({ where: { key }, data: { count: 1, windowStart: now } });
    return false;
  }
  const newCount = kc.count + 1;
  await prisma.keyCounter.update({ where: { key }, data: { count: newCount } });
  return newCount > limit;
}

export async function logFraud(
  kind: string,
  data: { ip?: string; userId?: string; viewKey?: string; reason?: string; score?: number; }
) {
  const { ip, userId, viewKey, reason, score } = data || {};
  await prisma.fraudEvent.create({
    data: {
      kind,
      ip: ip || null,
      userId: userId || null,
      viewKey: viewKey || null,
      reason: reason || null,
      score: typeof score === "number" ? score : 1,
    },
  });
}

/** Guard utility: checks IP block + rate limits; logs and returns error object if blocked. */
export async function fraudGuard(
  req: Request,
  opts: {
    scope: "serve" | "event" | "convert",
    userId?: string | null,
    viewKey?: string | null,
    ipOverride?: string | null,
    limits?: { perIp?: { limit: number; windowSec: number } }
  }
): Promise<{ blocked: false; ip: string } | { blocked: true; status: number; body: any }> {
  const ip = opts.ipOverride || getClientIp(req);
  const userId = opts.userId ?? undefined;
  const viewKey = opts.viewKey ?? undefined;

  // 1) Hard IP block
  if (await isIpBlocked(ip)) {
    await logFraud("IP_BLOCK", { ip, userId, viewKey, reason: "Blocked IP for scope " + opts.scope });
    return { blocked: true, status: 429, body: { ok: false, error: "FRAUD_BLOCKED_IP", scope: opts.scope } };
  }

  // 2) Rate limit per IP (scope-specific)
  const lim = opts.limits?.perIp;
  if (lim) {
    const over = await bumpAndOverLimit("rl:" + opts.scope + ":ip:" + ip, lim.limit, lim.windowSec);
    if (over) {
      await logFraud("RATE_LIMIT", {
        ip, userId, viewKey,
        reason: "Over limit (" + lim.limit + "/" + lim.windowSec + "s) in " + opts.scope
      });
      return { blocked: true, status: 429, body: { ok: false, error: "RATE_LIMITED", scope: opts.scope } };
    }
  }

  return { blocked: false, ip };
}
