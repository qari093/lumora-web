/* =====================================================================
   Phase 2 — Unified Hybrid Client Layer
   Provides: generateHybridClient() + useHybridGenerate() React hook
===================================================================== */

export type HybridType = "emoji" | "avatar";

export type GenerateRequest = {
  type: HybridType;
  text: string;
  provider?: "local" | "mirrorai" | "renderx";
};

export type GenerateResponse =
  | { ok: true; type: HybridType; provider?: string; url: string }
  | { ok: false; error: string };

export async function generateHybridClient(
  type: HybridType,
  text: string,
  provider?: string
): Promise<GenerateResponse> {
  try {
    const res = await fetch("/api/hybrid/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type, text, provider }),
    });
    const json = (await res.json().catch(async () => ({ ok: false, error: await res.text() }))) as GenerateResponse;
    return json;
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) };
  }
}

import { useCallback, useState } from "react";

export function useHybridGenerate() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async (req: GenerateRequest) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const resp = await generateHybridClient(req.type, req.text, req.provider);
    if (resp.ok) setResult(resp);
    else setError(resp.error);
    setLoading(false);
    return resp;
  }, []);

  return { run, loading, error, result };
}