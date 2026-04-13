import fs from "node:fs/promises";
import path from "node:path";
import type { LumoraSignal } from "@/types/lumora.signal";

export type ManualReviewReason =
  | "nsfw_flag"
  | "explicit_audio_flag"
  | "trust_anomaly"
  | "provider_warning"
  | "manual_escalation";

export type ManualReviewItem = {
  id: string;
  signalId: string;
  signalTitle: string;
  reason: ManualReviewReason;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
  updatedAt: number;
  meta?: Record<string, unknown>;
};

type ReviewStore = {
  items: ManualReviewItem[];
  updatedAt: number;
};

const STORE_DIR = path.join(process.cwd(), "data", "review");
const STORE_FILE = path.join(STORE_DIR, "manual-review-queue.json");

async function ensureStoreDir() {
  await fs.mkdir(STORE_DIR, { recursive: true });
}

async function readStore(): Promise<ReviewStore> {
  await ensureStoreDir();
  try {
    const raw = await fs.readFile(STORE_FILE, "utf8");
    const parsed = JSON.parse(raw) as ReviewStore;
    return {
      items: Array.isArray(parsed?.items) ? parsed.items : [],
      updatedAt: typeof parsed?.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return { items: [], updatedAt: Date.now() };
  }
}

async function writeStore(store: ReviewStore): Promise<ReviewStore> {
  await ensureStoreDir();
  const payload: ReviewStore = {
    items: Array.isArray(store.items) ? store.items : [],
    updatedAt: Date.now(),
  };
  await fs.writeFile(STORE_FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

export async function listManualReviewItems() {
  return readStore();
}

export async function enqueueManualReview(
  signal: LumoraSignal,
  reason: ManualReviewReason,
  meta?: Record<string, unknown>
): Promise<ManualReviewItem> {
  const store = await readStore();
  const existing = store.items.find(
    (item) => item.signalId === signal.id && item.reason === reason && item.status === "pending"
  );
  if (existing) return existing;

  const now = Date.now();
  const item: ManualReviewItem = {
    id: `review_${signal.id}_${now}`,
    signalId: signal.id,
    signalTitle: signal.title,
    reason,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    meta,
  };

  store.items.unshift(item);
  await writeStore(store);
  return item;
}

export async function updateManualReviewStatus(
  id: string,
  status: "approved" | "rejected"
): Promise<ManualReviewItem | null> {
  const store = await readStore();
  const idx = store.items.findIndex((item) => item.id === id);
  if (idx === -1) return null;

  const current = store.items[idx];
  const updated: ManualReviewItem = {
    ...current,
    status,
    updatedAt: Date.now(),
  };

  store.items[idx] = updated;
  await writeStore(store);
  return updated;
}
