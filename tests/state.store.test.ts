// FILE: tests/state.store.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../app/_state/store";

describe("LumaSpace Client State Store", () => {
  beforeEach(() => {
    // Reset between tests (do not keep snapshots)
    useAppStore.getState().clearMoodHistory();
    useAppStore.getState().setBalance(0);
  });

  it("credits and debits ZC correctly", () => {
    useAppStore.getState().credit(100);
    expect(useAppStore.getState().balance).toBe(100);

    const ok = useAppStore.getState().debit(40);
    expect(ok).toBe(true);
    expect(useAppStore.getState().balance).toBe(60);

    const fail = useAppStore.getState().debit(1000);
    expect(fail).toBe(false);
    expect(useAppStore.getState().balance).toBe(60);

    // invalid amounts are ignored
    useAppStore.getState().credit(-5 as any);
    useAppStore.getState().debit(-5 as any);
    expect(useAppStore.getState().balance).toBe(60);
  });

  it("sets mood and keeps history limited to 200 entries", () => {
    for (let i = 0; i < 205; i++) {
      useAppStore.getState().setMood("focus", 0.8);
    }
    expect(useAppStore.getState().history.length).toBe(200);
    expect(useAppStore.getState().current).toBe("focus");
  });

  it("clears mood history", () => {
    useAppStore.getState().setMood("joy", 0.9);
    expect(useAppStore.getState().history.length).toBe(1);
    useAppStore.getState().clearMoodHistory();
    expect(useAppStore.getState().history.length).toBe(0);
  });
})