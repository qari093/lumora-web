// FILE: app/_state/store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";

// ───────────────────────────────── Types ─────────────────────────────────
export type Emotion =
  | "calm"
  | "focus"
  | "joy"
  | "neutral"
  | "curious"
  | "anxious"
  | (string & {});

export interface MoodEntry {
  emotion: Emotion;
  intensity?: number; // 0..1
  at: number; // epoch ms
}

interface StoreState {
  // Mood slice
  current: Emotion | null;
  history: MoodEntry[];
  setMood: (emotion: Emotion, intensity?: number) => void;
  clearMoodHistory: () => void;

  // ZC slice
  balance: number;
  credit: (amount: number) => void;
  debit: (amount: number) => boolean;
  setBalance: (amount: number) => void;
}

// ─────────────────────────── Persist Key & Limits ───────────────────────────
const STORE_KEY = "lumora.state.v1";
const HISTORY_CAP = 200;

// ─────────────────────────── Robust storage (SSR/Vitest safe) ───────────────
type KV = {
  getItem: (k: string) => string | null;
  setItem: (k: string, v: string) => void;
  removeItem: (k: string) => void;
};

function makeMemoryKV(): KV {
  const mem = new Map<string, string>();
  return {
    getItem: (k) => (mem.has(k) ? mem.get(k)! : null),
    setItem: (k, v) => void mem.set(k, String(v)),
    removeItem: (k) => void mem.delete(k),
  };
}

function detectKV(): KV {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const t = "__kv_probe__";
      window.localStorage.setItem(t, "1");
      window.localStorage.removeItem(t);
      return window.localStorage;
    }
  } catch {
    // ignore and fallback to memory
  }
  return makeMemoryKV();
}

const kv = detectKV();

const stateStorage: StateStorage = {
  getItem: (name) => {
    try {
      return kv.getItem(name) ?? null;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      kv.setItem(name, value);
    } catch {
      // swallow persist errors in SSR/tests
    }
  },
  removeItem: (name) => {
    try {
      kv.removeItem(name);
    } catch {
      // swallow
    }
  },
};

// ─────────────────────────────── Store Definition ───────────────────────────
export const useAppStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Mood
      current: null,
      history: [],
      setMood: (emotion, intensity) => {
        const safeI =
          typeof intensity === "number" && isFinite(intensity)
            ? Math.max(0, Math.min(1, intensity))
            : undefined;
        const entry: MoodEntry = { emotion, intensity: safeI, at: Date.now() };
        const next = [...get().history, entry].slice(-HISTORY_CAP);
        set({ current: emotion, history: next });
      },
      clearMoodHistory: () => set({ history: [] }),

      // ZC
      balance: 0,
      credit: (amount) => {
        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) return;
        const next = Math.min(Number.MAX_SAFE_INTEGER, get().balance + n);
        set({ balance: next });
      },
      debit: (amount) => {
        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) return false;
        const bal = get().balance;
        if (bal < n) return false;
        set({ balance: bal - n });
        return true;
      },
      setBalance: (amount) => {
        const n = Number(amount);
        set({
          balance:
            Number.isFinite(n) && n >= 0
              ? Math.min(n, Number.MAX_SAFE_INTEGER)
              : 0,
        });
      },
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => stateStorage),
      version: 1,
      partialize: (s) => ({
        current: s.current,
        history: s.history.slice(-HISTORY_CAP),
        balance: s.balance,
      }),
    }
  )
);

// ────────────────────────────── Narrow Selectors ────────────────────────────
export const useZcBalance = () => useAppStore((s) => s.balance);
export const useMood = () => useAppStore((s) => s.current);
export const useMoodHistory = () => useAppStore((s) => s.history);
export const useSetMood = () => useAppStore((s) => s.setMood);