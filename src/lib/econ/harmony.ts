import fs from "node:fs";
import path from "node:path";

/**
 * Backing file:
 * - originally: { reserve, poolLive, lastUpdated }
 * - now extended to: { reserve, poolLive, lastUpdated, users }
 *   (loader migrates old shape automatically)
 */

type User = { balance: number; xp: number };
type Store =
  | { reserve: number; poolLive: number; lastUpdated: number } // legacy
  | {
      reserve: number;
      poolLive: number;
      lastUpdated: number;
      users: Record<string, User>;
    };

const STORE_PATH = path.resolve(process.cwd(), ".lumora-harmony.json");

function loadRaw(): Store {
  try {
    const txt = fs.readFileSync(STORE_PATH, "utf8");
    return JSON.parse(txt) as Store;
  } catch {
    return { reserve: 0, poolLive: 0, lastUpdated: Date.now(), users: {} } as Store;
  }
}

function normalize(s: Store): Required<Store> {
  const base = {
    reserve: (s as any).reserve ?? 0,
    poolLive: (s as any).poolLive ?? 0,
    lastUpdated: (s as any).lastUpdated ?? Date.now(),
  };
  const users = (s as any).users && typeof (s as any).users === "object" ? (s as any).users as Record<string, User> : {};
  return { ...base, users };
}

function save(s: Required<Store>) {
  fs.writeFileSync(STORE_PATH, JSON.stringify(s, null, 2));
}

function ensureUser(s: Required<Store>, userId: string) {
  if (!s.users[userId]) s.users[userId] = { balance: 0, xp: 0 };
}

/** ===== Public API (existing) ===== */

export async function snapshot() {
  return normalize(loadRaw());
}

export async function applyTreasurySplit(amount: number) {
  const s = normalize(loadRaw());
  const a = Math.max(0, Math.floor(amount || 0));
  s.reserve += Math.floor(a * 0.25);
  s.poolLive += Math.floor(a * 0.10);
  s.lastUpdated = Date.now();
  save(s);
  return { ok: true as const, reserve: s.reserve, poolLive: s.poolLive };
}

/** ===== New: minimal user flows for bridge ===== */

export async function statsToday(userId = "demo-user") {
  const s = normalize(loadRaw());
  ensureUser(s, userId);
  return {
    // global
    reserve: s.reserve,
    poolLive: s.poolLive,
    lastUpdated: s.lastUpdated,
    // per-user
    balance: s.users[userId].balance,
    xp: s.users[userId].xp,
    velocity: 1, // placeholder for later tuning
    earn: 0,
    spend: 0,
    burn: 0,
  };
}

/**
 * Earn: grants integer >=0 (clamped) and updates user + poolLive
 * Signature kept generic so bridges can pass note/daysSinceSignup if needed
 */
export async function earn(input: { userId: string; baseAmount: number; note?: string; daysSinceSignup?: number }) {
  const s = normalize(loadRaw());
  const userId = input?.userId || "demo-user";
  ensureUser(s, userId);

  const granted = Math.max(0, Math.min(1000000, Math.floor(Number(input?.baseAmount ?? 0))));
  s.users[userId].balance += granted;
  s.users[userId].xp += granted;
  s.poolLive += granted;
  s.lastUpdated = Date.now();

  save(s);
  return { granted, balance: s.users[userId].balance, xp: s.users[userId].xp };
}

/**
 * Spend: debits if sufficient balance; also reduces poolLive
 */
export async function spend(input: { userId: string; amount: number; note?: string }) {
  const s = normalize(loadRaw());
  const userId = input?.userId || "demo-user";
  ensureUser(s, userId);

  const amt = Math.max(0, Math.floor(Number(input?.amount ?? 0)));
  if (amt > s.users[userId].balance) {
    return { ok: false as const, error: "INSUFFICIENT_PULSE", balance: s.users[userId].balance };
  }

  s.users[userId].balance -= amt;
  s.poolLive = Math.max(0, s.poolLive - amt);
  s.lastUpdated = Date.now();

  save(s);
  return { ok: true as const, balance: s.users[userId].balance };
}