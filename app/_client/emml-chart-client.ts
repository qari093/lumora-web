"use client";

export type EmmlChartResponse = {
  ok: boolean;
  range: { from: string; to: string };
  meta: { unit: string; source: string };
  series: Array<{ key: string; points: Array<{ t: string; v: number }> }>;
};

async function safeJson(res: Response): Promise<any> {
  const txt = await res.text().catch(() => "");
  try { return txt ? JSON.parse(txt) : null; } catch { return null; }
}

export async function fetchEmmlChart(params?: { range?: string; signal?: AbortSignal }): Promise<EmmlChartResponse> {
  const q = new URLSearchParams();
  if (params?.range) q.set("range", params.range);
  const url = `/api/emml/chart${q.toString() ? `?${q.toString()}` : ""}`;
  const res = await fetch(url, { method: "GET", cache: "no-store", signal: params?.signal });
  const body = await safeJson(res);
  if (!res.ok) {
    return {
      ok: false,
      range: { from: new Date().toISOString(), to: new Date().toISOString() },
      meta: { unit: "idx", source: "unavailable" },
      series: [],
    };
  }
  return body as EmmlChartResponse;
}
