export type FetchTextResult = { ok: boolean; status: number; text: string; ct: string; url: string };

export function baseUrl(): string {
  const env = (process.env.BASE_URL || "").trim();
  if (env) return env.replace(/\/+$/, "");
  const port = (process.env.PORT || "3000").trim();
  return `http://127.0.0.1:${port}`;
}

export async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

export async function fetchTextRobust(
  path: string,
  opts?: { timeoutMs?: number; tries?: number; backoffMs?: number }
): Promise<FetchTextResult> {
  const timeoutMs = Math.max(1000, opts?.timeoutMs ?? 8000);
  const tries = Math.max(1, opts?.tries ?? 6);
  const backoffMs = Math.max(50, opts?.backoffMs ?? 120);

  const base = baseUrl();
  const url = new URL(path, base).toString();

  let lastErr: any = null;

  for (let i = 0; i < tries; i++) {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(new Error(`abort:${timeoutMs}ms`)), timeoutMs);
    try {
      const res = await fetch(url, { cache: "no-store", signal: ac.signal });
      const text = await res.text();
      const ct = res.headers.get("content-type") ?? "";
      return { ok: res.ok, status: res.status, text, ct, url };
    } catch (e: any) {
      lastErr = e;
      const msg = String(e?.message || e);
      const transient =
        msg.includes("ECONNREFUSED") ||
        msg.includes("fetch failed") ||
        msg.includes("network") ||
        msg.includes("abort:");
      if (!transient) throw e;
      await sleep(backoffMs * (i + 1));
    } finally {
      clearTimeout(t);
    }
  }

  throw lastErr ?? new Error("fetch_failed");
}
