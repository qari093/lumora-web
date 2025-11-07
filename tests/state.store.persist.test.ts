import { describe, it, expect, beforeEach, vi } from "vitest";

// Important: do not import the store at module top — we need fresh imports after mutations.

const STORE_KEY = "lumora.state.v1";
type Emotion = "calm" | "focus" | "joy" | "neutral" | "curious" | "anxious" | (string & {});

function putPersist(payload: any) {
  // Zustand persist default format: { state: {...}, version: 0 }
  const obj = { version: 0, ...payload };
  globalThis.localStorage.setItem(STORE_KEY, JSON.stringify(obj));
}

function clearPersist() {
  globalThis.localStorage.removeItem(STORE_KEY);
}

describe("LumaSpace Store — persist & rehydrate", () => {
  beforeEach(async () => {
    // Full module graph reset so store's persist layer re-reads storage
    await vi.resetModules();
    // clear storage between tests
    clearPersist();
  });

  it("rehydrates balance/current/history from localStorage", async () => {
    putPersist({
      state: {
        current: "joy" as Emotion,
        history: [{ emotion: "joy" as Emotion, intensity: 0.9, at: 111 }],
        balance: 123
      }
    });

    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();
    expect(s.current).toBe("joy");
    expect(s.history.length).toBe(1);
    expect(s.history[0].emotion).toBe("joy");
    expect(s.balance).toBe(123);
  });

  it("persists after actions then survives module reload", async () => {
    // first import, mutate, verify persisted payload written
    {
      const { useAppStore } = await import("../app/_state/store");
      const s = useAppStore.getState();
      s.setMood("focus", 0.8);
      s.credit(77);
      expect(s.current).toBe("focus");
      expect(s.balance).toBe(77);
      // localStorage should now contain JSON with state.balance === 77
      const raw = globalThis.localStorage.getItem(STORE_KEY);
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(String(raw));
      expect(parsed.state.balance).toBe(77);
      expect(parsed.state.current).toBe("focus");
    }

    // fresh module import must rehydrate those values
    await vi.resetModules();
    const { useAppStore: freshStore } = await import("../app/_state/store");
    const s2 = freshStore.getState();
    expect(s2.balance).toBe(77);
    expect(s2.current).toBe("focus");
    expect(s2.history.length).toBeGreaterThanOrEqual(1);
  });

  it("starts from defaults on corrupt storage and does not throw", async () => {
    globalThis.localStorage.setItem(STORE_KEY, "{not-json");
    // Import should not throw; store should fallback to defaults
    const { useAppStore } = await import("../app/_state/store");
    const s = useAppStore.getState();
    expect(s.balance).toBeGreaterThanOrEqual(0); // default 0
    // Ensure actions still work after fallback
    s.credit(5);
    expect(s.balance).toBe(5);
  });
});
