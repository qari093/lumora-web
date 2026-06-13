import fs from "node:fs";
import path from "node:path";

export type StoredFypEventType =
  | "impression"
  | "view"
  | "watch_progress"
  | "spark"
  | "save"
  | "deep_dive"
  | "complete"
  | "skip"
  | "share";

export type StoredFypEvent = {
  id: string;
  cardId: string;
  event: StoredFypEventType;
  value: number;
  watchedMs: number;
  lane?: string;
  sessionId: string;
  userId: string;
  ts: number;
  source: "fyp_tracking_v1";
};

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "fyp-events.json");
const MAX_EVENTS = 1500;

function clamp(value: unknown, min: number, max: number, fallback: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}

function safeString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value.trim().slice(0, 160) : fallback;
}

function readAll(): StoredFypEvent[] {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed.filter(Boolean).slice(-MAX_EVENTS) : [];
  } catch {
    return [];
  }
}

function writeAll(events: StoredFypEvent[]): void {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(events.slice(-MAX_EVENTS), null, 2) + "\n");
}

export function normalizeFypEvent(input: any): StoredFypEvent | null {
  const cardId = safeString(input?.cardId ?? input?.id ?? input?.videoId, "");
  const rawEvent = safeString(input?.event ?? input?.type, "view") as StoredFypEventType;

  const allowed: StoredFypEventType[] = [
    "impression",
    "view",
    "watch_progress",
    "spark",
    "save",
    "deep_dive",
    "complete",
    "skip",
    "share"
  ];

  if (!cardId || !allowed.includes(rawEvent)) return null;

  const watchedMs = clamp(input?.watchedMs ?? input?.ms, 0, 60 * 60 * 1000, 0);
  const eventValue =
    rawEvent === "skip" ? -0.35 :
    rawEvent === "spark" ? 0.75 :
    rawEvent === "save" ? 0.85 :
    rawEvent === "share" ? 0.9 :
    rawEvent === "deep_dive" ? 0.8 :
    rawEvent === "complete" ? 1 :
    rawEvent === "watch_progress" ? clamp(watchedMs / 30000, 0.05, 1, 0.2) :
    rawEvent === "view" ? 0.5 :
    0.25;

  return {
    id: safeString(input?.eventId, `fyp_evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`),
    cardId,
    event: rawEvent,
    value: clamp(input?.value, -1, 1, eventValue),
    watchedMs,
    lane: typeof input?.lane === "string" ? input.lane.slice(0, 32) : undefined,
    sessionId: safeString(input?.sessionId, "anonymous-session"),
    userId: safeString(input?.userId, "anonymous-user"),
    ts: Date.now(),
    source: "fyp_tracking_v1"
  };
}

export function appendFypEvent(input: any): StoredFypEvent | null {
  const event = normalizeFypEvent(input);
  if (!event) return null;

  const events = readAll();
  events.push(event);
  writeAll(events);

  return event;
}

export function readRecentFypEvents(limit = 200): StoredFypEvent[] {
  return readAll().slice(-clamp(limit, 1, MAX_EVENTS, 200));
}

export function clearFypEventsForTest(): void {
  try {
    fs.unlinkSync(STORE_PATH);
  } catch {}
}
