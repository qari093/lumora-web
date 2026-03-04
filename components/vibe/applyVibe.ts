export type ApplyVibeInput = {
  userId: string;
  videoId: string;
  vibeSlug: string;
  watchMs: number;
};

export type ApplyVibeResponse =
  | { ok: true; status: "applied" | "duplicate_vibe"; totalVibes?: number }
  | { ok: false; error: string };

export async function applyVibe(input: ApplyVibeInput): Promise<ApplyVibeResponse> {
  const res = await fetch("/api/vibe/apply", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });

  const json = (await res.json().catch(() => null)) as any;

  if (!res.ok || !json?.ok) {
    return { ok: false, error: String(json?.error || "apply_failed") };
  }
  return json as ApplyVibeResponse;
}
