/**
 * EMML Chart fetch helper used by UI tests and the /app/emml/chart page.
 * - Safe for client usage (uses global fetch).
 * - Defaults to calling the same-origin API route: /api/emml/chart
 * - Can be overridden via absolute/relative URL.
 */

export type EmmlChartPoint = {
  t: number; // unix ms
  v: number; // value
};

export type EmmlChartResponse =
  | { ok: true; points: EmmlChartPoint[]; ts: number }
  | { ok: false; error: string; ts: number };

export type FetchEmmlChartOptions = {
  url?: string;            // default: "/api/emml/chart"
  timeoutMs?: number;      // default: 8000
  signal?: AbortSignal;    // optional external cancellation
};

function withTimeout<T>(p: Promise<T>, ms: number, signal?: AbortSignal): Promise<T> {
  if (ms <= 0) return p;
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  let timer: any;

  // If caller provided a signal, mirror it
  if (signal) {
    if (signal.aborted) ctrl.abort();
    else signal.addEventListener("abort", onAbort, { once: true });
  }

  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      ctrl.abort();
      reject(new Error("timeout"));
    }, ms);
  });

  return Promise.race([
    p.finally(() => {
      if (timer) clearTimeout(timer);
      if (signal) signal.removeEventListener("abort", onAbort);
    }),
    timeout,
  ]) as Promise<T>;
}

/**
 * Fetch EMML chart points.
 * Returns a stable shape for callers/tests.
 */
export async function fetchEmmlChart(opts: FetchEmmlChartOptions = {}): Promise<EmmlChartResponse> {
  const url = (opts.url && opts.url.length > 0) ? opts.url : "/api/emml/chart";
  const timeoutMs = typeof opts.timeoutMs === "number" ? opts.timeoutMs : 8000;

  try {
    const res = await withTimeout(
      fetch(url, {
        method: "GET",
        headers: { "accept": "application/json" },
        cache: "no-store",
        signal: opts.signal,
      }),
      timeoutMs,
      opts.signal
    );

    if (!res.ok) {
      return { ok: false, error: `http_${res.status}`, ts: Date.now() };
    }

    const data: any = await res.json().catch(() => null);
    if (!data || data.ok !== true || !Array.isArray(data.points)) {
      // Be permissive: if API returns another shape, adapt best-effort
      const points = Array.isArray(data?.data) ? data.data : [];
      return { ok: true, points, ts: Date.now() };
    }

    return { ok: true, points: data.points as EmmlChartPoint[], ts: typeof data.ts === "number" ? data.ts : Date.now() };
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "fetch_failed";
    return { ok: false, error: msg, ts: Date.now() };
  }
}
