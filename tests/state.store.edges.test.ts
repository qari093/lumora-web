import { describe, it, expect, beforeEach } from "vitest";
import { useAppStore } from "../app/_state/store";

describe("LumaSpace Store — edges", () => {
  beforeEach(() => {
    const s = useAppStore.getState();
    s.clearMoodHistory();
    s.setBalance(0);
  });

  it("clearMoodHistory keeps current intact", () => {
    const s = useAppStore.getState();
    s.setMood("focus", 0.8);
    expect(useAppStore.getState().history.length).toBe(1);
    expect(useAppStore.getState().current).toBe("focus");
    s.clearMoodHistory();
    expect(useAppStore.getState().history.length).toBe(0);
    expect(useAppStore.getState().current).toBe("focus");
  });

  it("debit rejects zero/negative and overdraw", () => {
    const s = useAppStore.getState();
    s.credit(50);
    expect(useAppStore.getState().balance).toBe(50);
    expect(s.debit(0)).toBe(false);
    expect(s.debit(-10 as unknown as number)).toBe(false);
    expect(useAppStore.getState().balance).toBe(50);
    expect(s.debit(9999)).toBe(false);
    expect(useAppStore.getState().balance).toBe(50);
  });

  it("credit ignores non-finite or non-positive", () => {
    const s = useAppStore.getState();
    s.credit(NaN);
    s.credit(-5);
    s.credit(0);
    expect(useAppStore.getState().balance).toBe(0);
    s.credit(7.5);
    expect(useAppStore.getState().balance).toBe(7.5);
  });

  it("setBalance clamps to >= 0 and handles strings", () => {
    const s = useAppStore.getState();
    s.setBalance(-100);
    expect(useAppStore.getState().balance).toBe(0);
    s.setBalance("42" as unknown as number);
    expect(useAppStore.getState().balance).toBe(42);
  });
});
