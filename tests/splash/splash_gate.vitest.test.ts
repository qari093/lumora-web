import { act } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
function setMatchMediaReduce(reduce: boolean) {
  // @ts-expect-error
  globalThis.window.matchMedia = (q: string) => ({
    matches: q.includes("prefers-reduced-motion") ? reduce : false,
    media: q,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

function clearDOM() {
  document.documentElement.innerHTML = "<head></head><body></body>";
}

async function flushEffects() {
  // React 18 effects flush reliably through act().
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });
}

describe("SplashGate — session + reduced motion (DOM smoke)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    clearDOM();
    sessionStorage.clear();
    setMatchMediaReduce(false);
  });

  it("writes session flag when splash shows (once-per-session)", async () => {
    const key = "lumora:splash:shown:v1";
    expect(sessionStorage.getItem(key)).toBe(null);

    const mod = await import("../../components/splash/SplashGate");
    const SplashGate = mod.default;

    const React = await import("react");
    const ReactDOM = await import("react-dom/client");

    const host = document.createElement("div");
    document.body.appendChild(host);

    const root = ReactDOM.createRoot(host);

    await act(async () => {
      root.render(React.createElement(SplashGate, null));
    });

    await flushEffects();

    expect(sessionStorage.getItem(key)).toBe("1");

    await act(async () => {
      root.unmount();
    });
  });

  it("reduced motion prevents showing (no session flag)", async () => {
    setMatchMediaReduce(true);

    const key = "lumora:splash:shown:v1";
    const mod = await import("../../components/splash/SplashGate");
    const SplashGate = mod.default;

    const React = await import("react");
    const ReactDOM = await import("react-dom/client");

    const host = document.createElement("div");
    document.body.appendChild(host);

    const root = ReactDOM.createRoot(host);

    await act(async () => {
      root.render(React.createElement(SplashGate, null));
    });

    await flushEffects();

    expect(sessionStorage.getItem(key)).toBe(null);

    await act(async () => {
      root.unmount();
    });
  });

  it("overlay exists, then hides after (durationMs - fadeOutMs)", async () => {
    const mod = await import("../../components/splash/SplashGate");
    const SplashGate = mod.default;

    const React = await import("react");
    const ReactDOM = await import("react-dom/client");

    const host = document.createElement("div");
    document.body.appendChild(host);

    const root = ReactDOM.createRoot(host);

    await act(async () => {
      root.render(React.createElement(SplashGate, { durationMs: 1000, fadeOutMs: 200 }));
    });

    await flushEffects();

    const exists = () => !!document.querySelector("[data-fadeout-ms]");
    expect(exists()).toBe(true);

    // SplashGate hides at durationMs - fadeOutMs = 800ms
    await act(async () => {
      vi.advanceTimersByTime(799);
    });
    expect(exists()).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(3);
    });
    expect(exists()).toBe(false);

    await act(async () => {
      root.unmount();
    });
  });
});


afterAll(() => {
  vi.useRealTimers();
});
