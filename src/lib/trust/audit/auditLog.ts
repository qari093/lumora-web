import fs from "node:fs/promises";
import path from "node:path";

export type TrustAuditEvent = {
  id: string;
  type:
    | "fake_engagement_check"
    | "bot_pattern_check"
    | "anomaly_check"
    | "semantic_check"
    | "toxic_velocity_check"
    | "scam_check"
    | "misinformation_check"
    | "trust_score_compute"
    | "trust_filter_refresh";
  signalId?: string;
  meta?: Record<string, unknown>;
  createdAt: number;
};

export type TrustAuditStore = {
  updatedAt: number;
  events: TrustAuditEvent[];
};

const OUT_DIR = path.join(process.cwd(), "data", "trust");
const OUT_FILE = path.join(OUT_DIR, "audit.log.json");

async function ensureDir() {
  await fs.mkdir(OUT_DIR, { recursive: true });
}

export async function readTrustAuditStore(): Promise<TrustAuditStore> {
  await ensureDir();

  try {
    const raw = await fs.readFile(OUT_FILE, "utf8");
    const parsed = JSON.parse(raw) as TrustAuditStore;
    return {
      updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
      events: Array.isArray(parsed?.events) ? parsed.events : [],
    };
  } catch {
    return {
      updatedAt: Date.now(),
      events: [],
    };
  }
}

export async function appendTrustAuditEvent(
  event: Omit<TrustAuditEvent, "id" | "createdAt">
): Promise<TrustAuditEvent> {
  const store = await readTrustAuditStore();
  const createdAt = Date.now();
  const item: TrustAuditEvent = {
    id: `audit_${createdAt}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    ...event,
  };

  store.events.unshift(item);
  const next: TrustAuditStore = {
    updatedAt: Date.now(),
    events: store.events.slice(0, 5000),
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(next, null, 2), "utf8");
  return item;
}
