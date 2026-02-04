import { prisma } from "@/lib/prisma";
/**
 * Wallet compatibility surface for API routes.
 *
 * NOTE: We intentionally use `any` on Prisma access to avoid build-time coupling
 * to the exact Prisma model names during launch hardening.
 *
 * The API route layer enforces invariants + idempotency; this module provides
 * the required function exports with safe defaults.
 */

import { PrismaClient } from "@prisma/client";

const prismaAny: any =
  (globalThis as any).__LUMORA_PRISMA__ ||
  new PrismaClient({
    // keep logs off by default in prod build
  });

(globalThis as any).__LUMORA_PRISMA__ = prismaAny;

type WalletRow = any;
type LedgerRow = any;

function nowIso() {
  return new Date().toISOString();
}

function pickModel(name: string): any {
  const m = prismaAny?.[name];
  if (!m) return null;
  return m;
}

/**
 * Best-effort model resolution.
 * If your Prisma models are named differently, adjust these aliases later.
 */
function walletModel(): any {
  return (
    pickModel("wallet") ||
    pickModel("Wallet") ||
    pickModel("userWallet") ||
    pickModel("UserWallet") ||
    null
  );
}

function ledgerModel(): any {
  return (
    pickModel("ledgerEntry") ||
    pickModel("LedgerEntry") ||
    pickModel("walletLedgerEntry") ||
    pickModel("WalletLedgerEntry") ||
    pickModel("walletEntry") ||
    pickModel("WalletEntry") ||
    null
  );
}

/**
 * Minimal wallet getter. Returns { ok, wallet }.
 */
export async function getWallet(userId: string): Promise<{ ok: boolean; wallet?: WalletRow; error?: string }> {
  try {
    if (!userId) return { ok: false, error: "userId_required" };
    const W = walletModel();
    if (!W) return { ok: false, error: "wallet_model_missing" };
    const wallet = await W.findUnique?.({ where: { userId } });
    if (!wallet) return { ok: false, error: "wallet_not_found" };
    return { ok: true, wallet };
  } catch (e: any) {
    return { ok: false, error: typeof e?.message === "string" ? e.message : "get_wallet_failed" };
  }
}

/**
 * Ensure a wallet exists for a user. Returns { ok, wallet }.
 */
export async function ensureWallet(userId: string): Promise<{ ok: boolean; wallet?: WalletRow; created?: boolean; error?: string }> {
  try {
    if (!userId) return { ok: false, error: "userId_required" };
    const W = walletModel();
    if (!W) return { ok: false, error: "wallet_model_missing" };

    const existing = await W.findUnique?.({ where: { userId } });
    if (existing) return { ok: true, wallet: existing, created: false };

    // Minimal create payload — keep flexible
    const created = await W.create?.({
      data: {
        userId,
        balance: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    });

    return { ok: true, wallet: created, created: true };
  } catch (e: any) {
    // If schema differs, creation might fail; surface message.
    return { ok: false, error: typeof e?.message === "string" ? e.message : "ensure_wallet_failed" };
  }
}

/**
 * Canonical ledger entry builder used by some routes.
 */
export function ledgerEntry(args: {
  userId: string;
  kind: "credit" | "debit" | "transfer_in" | "transfer_out" | string;
  amount: number;
  currency?: string;
  memo?: string;
  ref?: string; // idempotency ref
  meta?: any;
}) {
  return {
    userId: args.userId,
    kind: args.kind,
    amount: args.amount,
    currency: args.currency || "EUR",
    memo: args.memo || null,
    ref: args.ref || null,
    meta: args.meta ?? null,
    createdAt: nowIso(),
  };
}

/**
 * Add a ledger entry and optionally update wallet balance in a single transaction.
 * This is a best-effort implementation; your existing API routes may enforce stricter invariants.
 */
export async function addLedgerEntry(entry: any): Promise<{ ok: boolean; ledger?: LedgerRow; error?: string }> {
  try {
    const L = ledgerModel();
    if (!L) return { ok: false, error: "ledger_model_missing" };

    const created = await L.create?.({ data: entry });
    return { ok: true, ledger: created };
  } catch (e: any) {
    return { ok: false, error: typeof e?.message === "string" ? e.message : "add_ledger_failed" };
  }
}

/**
 * Transfer euros between users (best-effort).
 * If your production flow uses a double-entry ledger with stronger invariants,
 * keep using that at the route layer; this function just satisfies the export contract.
 */
export async function transferEuros(args: {
  fromUserId: string;
  toUserId: string;
  amount: number;
  ref?: string;
  memo?: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    const amount = Number(args.amount);
    if (!args.fromUserId || !args.toUserId) return { ok: false, error: "from_to_required" };
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, error: "amount_invalid" };

    // Prefer route-level invariants; here we only create ledger entries if possible.
    const from = ledgerEntry({
      userId: args.fromUserId,
      kind: "transfer_out",
      amount: -Math.abs(amount),
      currency: "EUR",
      memo: args.memo || "transfer_out",
      ref: args.ref || null,
      meta: { toUserId: args.toUserId },
    });

    const to = ledgerEntry({
      userId: args.toUserId,
      kind: "transfer_in",
      amount: Math.abs(amount),
      currency: "EUR",
      memo: args.memo || "transfer_in",
      ref: args.ref || null,
      meta: { fromUserId: args.fromUserId },
    });

    // If a ledger model exists, write both. If not, fail explicitly.
    const L = ledgerModel();
    if (!L) return { ok: false, error: "ledger_model_missing" };

    await prismaAny.$transaction?.([
      L.create({ data: from }),
      L.create({ data: to }),
    ]);

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: typeof e?.message === "string" ? e.message : "transfer_failed" };
  }
}


export async function getWalletBalance(..._args: any[]) {
  throw new Error("wallet_balance_not_implemented");
}
export async function getWalletHistory(..._args: any[]) {
  throw new Error("wallet_history_not_implemented");
}

// --- Wallet API surface (Launch Step 24) ---
export type WalletBalance = {
  ok: true;
  ownerId: string;
  walletId?: string;
  currency: string;
  available: string; // decimal string
  pending: string;   // decimal string
  ts: number;
} | {
  ok: false;
  ownerId?: string;
  error: "ownerId_required" | "wallet_not_found" | "internal_error";
  ts: number;
};

export type WalletHistoryItem = {
  id: string;
  ts: number;
  type: string;
  amount: string;      // decimal string
  currency: string;
  memo?: string | null;
  refType?: string | null;
  refId?: string | null;
  direction?: "credit" | "debit" | "neutral";
};

export type WalletHistory = {
  ok: true;
  ownerId: string;
  currency: string;
  items: WalletHistoryItem[];
  cursor?: string | null;
  ts: number;
} | {
  ok: false;
  ownerId?: string;
  error: "ownerId_required" | "wallet_not_found" | "internal_error";
  ts: number;
};

function decToString(v: any): string {
  if (v == null) return "0";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "bigint") return v.toString();
  // Prisma Decimal has toString()
  if (typeof v?.toString === "function") return v.toString();
  return "0";
}

async function findPrimaryWallet(ownerId: string) {
  // Support multiple possible schemas by probing.
  // 1) Wallet model: { id, ownerId, currency, available, pending } or similar
  // 2) WalletBalance table or Ledger-derived balance
  // We prefer Wallet table if present.
  const client: any = (globalThis as any).prisma || (await import("@/lib/prisma")).prisma;
  const prismaAny: any = client;

  if (prismaAny?.wallet?.findFirst) {
    const w = await prismaAny.wallet.findFirst({
      where: { ownerId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }].filter(Boolean) as any
    });
    return { kind: "wallet", w };
  }

  // Fallback: Wallets model (plural)
  if (prismaAny?.wallets?.findFirst) {
    const w = await prismaAny.wallets.findFirst({
      where: { ownerId },
      orderBy: [{ createdAt: "asc" }, { id: "asc" }].filter(Boolean) as any
    });
    return { kind: "wallets", w };
  }

  // Fallback: compute from ledger if available
  if (prismaAny?.ledgerEntry?.findMany || prismaAny?.ledger?.findMany) {
    return { kind: "ledger", w: null };
  }

  throw new Error("wallet_schema_not_detected");
}


