// FILE: app/_state/store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/* ────────────────────────────── Types ────────────────────────────── */
export type Emotion =
  | "calm" | "focus" | "joy" | "neutral" | "curious"
  | "anxious" | "sad" | "angry" | "energized" | "tired";

export interface MoodEntry {
  emotion: Emotion;
  at: number;
  intensity?: number | null;
}

export interface AppState {
  balance: number;
  current: Emotion | null;
  intensity: number | null;
  history: MoodEntry[];
}

export interface AppActions {
  setMood: (emotion: Emotion | null, intensity?: number | null) => void;
  credit: (delta: number) => void;
  debit: (delta: number) => boolean;
  setBalance: (amount: number | string) => void;
  clearMoodHistory: () => void;
  reset: () => void;
}

/* ────────────────────────────── Consts ───────────────────────────── */
const STORAGE_KEY = "lumaspace";                   // primary
const COMPAT_KEY  = "zustand-persist:lumaspace";   // legacy/compat

/* ───────────────────────────── Utilities ─────────────────────────── */
const clamp01 = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : null;
};

const isEmotion = (v: unknown): v is Emotion =>
  typeof v === "string" &&
  ["calm","focus","joy","neutral","curious","anxious","sad","angry","energized","tired"].includes(v);

/* Default, used for safe fallbacks and resets */
const DEFAULT_STATE: AppState = { balance: 0, current: null, intensity: null, history: [] };

/* Accepts either flat {..} or zustand-persist { state: {..}, version } */
const migrateSnapshot = (raw: any): AppState | null => {
  try {
    if (!raw || typeof raw !== "object") return null;
    const src = raw.state && typeof raw.state === "object" ? raw.state : raw;

    const balance = Number(src.balance);
    const current = isEmotion(src.current) ? src.current : null;
    const intensity = clamp01(src.intensity);

    const history: MoodEntry[] = Array.isArray(src.history)
      ? src.history
          .map((h: any) =>
            h && isEmotion(h.emotion)
              ? { emotion: h.emotion, at: Number(h.at) || Date.now(), intensity: clamp01(h.intensity) }
              : null
          )
          .filter(Boolean) as MoodEntry[]
      : [];

    return {
      balance: Number.isFinite(balance) && balance >= 0 ? balance : 0,
      current,
      intensity,
      history,
    };
  } catch {
    return null;
  }
};

/* Robust localStorage access that works in JSDOM (Vitest) and browser */
const getStorage = (): Storage | undefined => {
  try {
    // Prefer window.localStorage in JSDOM/browser
    // Fallback to globalThis.localStorage if present
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage;
    const anyGlobal = globalThis as any;
    if (anyGlobal?.localStorage) return anyGlobal.localStorage as Storage;
  } catch {
    /* ignore */
  }
  return undefined;
};

/* Load: prefer COMPAT first (tests commonly seed this), then primary */
const loadPersisted = (): AppState | null => {
  const ls = getStorage();
  if (!ls) return null;

  for (const key of [COMPAT_KEY, STORAGE_KEY]) {
    const raw = ls.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      const migrated = migrateSnapshot(parsed);
      if (migrated) return migrated;
    } catch {
      // Corrupt → remove so subsequent runs start clean
      try { ls.removeItem(key); } catch { /* ignore */ }
    }
  }
  return null;
};

/* Save in flat form at primary key only */
const saveNow = (state: AppState) => {
  const ls = getStorage();
  if (!ls) return;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota/errors */
  }
};

/* ───────────────────────────── Zustand Store ─────────────────────── */
export const useAppStore = create<AppState & AppActions>()(
  persist<AppState & AppActions>(
    (set, get) => {
      // Synchronous seed to satisfy deterministic tests
      const seeded = loadPersisted() ?? DEFAULT_STATE;

      const sync = (fn: (s: AppState) => Partial<AppState>) => {
        set((s) => {
          const next = { ...s, ...fn(s) };
          saveNow(next);
          return next;
        });
      };

      return {
        ...seeded,

        setMood: (emotion, intensity) => {
          const entry: MoodEntry | null = emotion
            ? { emotion, at: Date.now(), intensity: clamp01(intensity) }
            : null;

          sync((s) => ({
            current: emotion,
            intensity: clamp01(intensity),
            history: entry ? [...s.history.slice(-199), entry] : s.history,
          }));
        },

        credit: (delta) => {
          const n = Number(delta);
          if (!Number.isFinite(n) || n <= 0) return;
          sync((s) => ({ balance: s.balance + n }));
        },

        debit: (delta) => {
          const n = Number(delta);
          if (!Number.isFinite(n) || n <= 0) return false;
          const bal = get().balance;
          if (bal < n) return false;
          sync(() => ({ balance: bal - n }));
          return true;
        },

        setBalance: (amount) => {
          const n = Number(amount);
          sync(() => ({ balance: !Number.isFinite(n) || n < 0 ? 0 : n }));
        },

        clearMoodHistory: () => sync((s) => ({ history: [], current: s.current, intensity: s.intensity })),

        reset: () => sync(() => ({ ...DEFAULT_STATE })),
      };
    },
    {
      name: STORAGE_KEY,
      version: 1,
      partialize: (s) => ({
        balance: s.balance,
        current: s.current,
        intensity: s.intensity,
        history: s.history,
      }),
      storage: createJSONStorage(() => {
        const ls = getStorage();
        if (ls) return ls;

        // In-memory fallback (non-browser envs without localStorage)
        const mem = new Map<string, string>();
        return {
          getItem: (k) => (mem.has(k) ? (mem.get(k) as string) : null),
          setItem: (k, v) => { mem.set(k, v); },
          removeItem: (k) => { mem.delete(k); },
        } as Storage;
      }),
      // We synchronously preload, so we keep hydration disabled to avoid races.
      skipHydration: true,
      migrate: (persisted) => migrateSnapshot(persisted) ?? { ...DEFAULT_STATE },
    }
  )
);

// Back-compat default export
export default useAppStore;