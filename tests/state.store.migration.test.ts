// FILE: tests/state.store.migration.test.ts
// Step 15.97 — LumaSpace store migration & rehydrate tests

import { describe, it, expect, beforeEach, vi } from "vitest";

const PRIMARY = "lumaspace";
const COMPAT = "zustand-persist:lumaspace";

describe("LumaSpace Store — migration & rehydrate", () => {
  beforeEach(() => {
    vi.resetModules();
    // ensure a clean storage surface each test
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
      localStorage.removeItem(PRIMARY);
      localStorage.removeItem(COMPAT);
    }
  });

  it("rehydrates from compat key {version, state:{...}} with mood/history", async () => {
    localStorage.setItem(
      COMPAT,
      JSON.stringify({
        version: 1,
        state: {
          balance: 12,
          current: "joy",
          intensity: 0.7,
          history: [{ emotion: "joy", at: 111, intensity: 0.7 }],
        },
      })
    );

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    expect(s.balance).toBe(12);
    expect(s.current).toBe("joy");
    expect(s.intensity).toBeCloseTo(0.7);
    expect(s.history.length).toBe(1);
    expect(s.history[0].emotion).toBe("joy");
  });

  it("prefers compat key over primary when both exist", async () => {
    localStorage.setItem(
      PRIMARY,
      JSON.stringify({
        balance: 77,
        current: "focus",
        intensity: 0.8,
        history: [],
      })
    );
    localStorage.setItem(
      COMPAT,
      JSON.stringify({
        version: 1,
        state: {
          balance: 9,
          current: "calm",
          intensity: 0.2,
          history: [],
        },
      })
    );

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    expect(s.balance).toBe(9);
    expect(s.current).toBe("calm");
    expect(s.intensity).toBeCloseTo(0.2);
  });

  it("falls back to primary key when compat is missing", async () => {
    localStorage.setItem(
      PRIMARY,
      JSON.stringify({
        balance: 33,
        current: "focus",
        intensity: 0.9,
        history: [{ emotion: "focus", at: 222, intensity: 0.9 }],
      })
    );

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    expect(s.balance).toBe(33);
    expect(s.current).toBe("focus");
    expect(s.intensity).toBeCloseTo(0.9);
    expect(s.history.length).toBe(1);
    expect(s.history[0].emotion).toBe("focus");
  });

  it("starts from defaults when only corrupt data exists (both keys removed)", async () => {
    localStorage.setItem(PRIMARY, "{not-json}");
    localStorage.setItem(COMPAT, "{also-bad}");

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();

    // default state
    expect(s.balance).toBe(0);
    expect(s.current).toBeNull();

    // ensure we can still mutate and persist cleanly afterwards
    s.credit(5);
    const after = useAppStore.getState();
    expect(after.balance).toBe(5);

    const raw = localStorage.getItem(PRIMARY) || "{}";
    const parsed = JSON.parse(raw);
    const state = (parsed as any).state ?? parsed;

    expect(state.balance).toBe(5);
  });
});

console.log("Step 15.97 — migration spec loaded");
