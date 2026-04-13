import type { TrustScoreInput } from "./trustScore";

export async function fetchTrustScore(input: TrustScoreInput) {
  try {
    const res = await fetch("/api/trust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
