// FILE: tests/state.store.persist.test.ts
// LumaSpace store — persist & rehydrate behaviour

import { describe, it, expect, beforeEach, vi } from "vitest";

// Important: do not import the store at module top — we need fresh imports after mutations.

// Must match the store's persist `name` in app/_state/store.ts
const PRIMARY_KEY = "lumaspace";

type Emotion =
  | "calm"
  | "focus"
  | "joy"
  | "neutral"
  | "curious"
  | "anxious"
  | (string & {});

function putPersist(payload: any) {
  // Zustand persist default format: { version, state: {...} }
  const obj = { version: 1, ...payload };
  globalThis.localStorage.setItem(PRIMARY_KEY, JSON.stringify(obj));
}

function clearPersist() {
  globalThis.localStorage.removeItem(PRIMARY_KEY);
}

describe("LumaSpace Store — persist & rehydrate", () => {
  beforeEach(() => {
    // Full module graph reset so store's persist layer re-reads storage
    vi.resetModules();
    if (typeof globalThis.localStorage !== "undefined") {
      globalThis.localStorage.clear();
      clearPersist();
    }
  });

  it("rehydrates balance/current/history from localStorage", async () => {
    putPersist({
      state: {
        current: "joy" as Emotion,
        history: [{ emotion: "joy" as Emotion, intensity: 0.9, at: 111 }],
        balance: 123,
        intensity: 0.9,
      },
    });

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    expect(s.current).toBe("joy");
    expect(s.history.length).toBe(1);
    expect(s.history[0].emotion).toBe("joy");
    expect(s.balance).toBe(123);
    expect(s.intensity).toBeCloseTo(0.9);
  });

  it("persists after actions then survives module reload", async () => {
    // first import, mutate, verify persisted payload written
    {
      const { useAppStore } = await import("../app/_state/store");
      const before = useAppStore.getState();

      before.setMood("focus", 0.8);
      before.credit(77);

      // re-read snapshot after mutations
      const s = useAppStore.getState();

      // we assert on balance + history; current/intensity may be derived differently
      expect(s.balance).toBe(77);
      expect(Array.isArray(s.history)).toBe(true);
      if (s.history.length > 0) {
        expect(s.history[s.history.length - 1].emotion).toBe("focus");
      }

      // localStorage should now contain JSON with state.balance === 77
      const raw = globalThis.localStorage.getItem(PRIMARY_KEY);
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(String(raw));
      const state = (parsed as any).state ?? parsed;

      expect(state.balance).toBe(77);
      if (Array.isArray(state.history) && state.history.length > 0) {
        expect(state.history[state.history.length - 1].emotion).toBe("focus");
      }
    }

    // fresh module import must rehydrate those values from the same key
    vi.resetModules();
    const { useAppStore: freshStore } = await import("../app/_state/store");
    const s2 = freshStore.getState();

    expect(s2.balance).toBe(77);
    expect(Array.isArray(s2.history)).toBe(true);
    if (s2.history.length > 0) {
      expect(s2.history[s2.history.length - 1].emotion).toBe("focus");
    }
  });

  it("starts from defaults on corrupt storage and does not throw", async () => {
    // broken JSON should be ignored gracefully
    globalThis.localStorage.setItem(PRIMARY_KEY, "{not-json");

    // Import should not throw; store should fallback to defaults
    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    // default state after safe fallback
    expect(s.balance).toBe(0);
    expect(s.current).toBeNull();

    // Ensure actions still work after fallback and now persist cleanly
    s.credit(5);
    const after = useAppStore.getState();
    expect(after.balance).toBe(5);

    const raw = globalThis.localStorage.getItem(PRIMARY_KEY) || "{}";
    const parsed = JSON.parse(raw);
    const state = (parsed as any).state ?? parsed;

    expect(state.balance).toBe(5);
  });
});

console.log("Step 15.105 — persist spec loaded");