export async function fetchCreatorThresholds(input: {
  reports?: number;
  strikes?: number;
  verified?: boolean;
  positiveEvents?: number;
}) {
  try {
    const res = await fetch("/api/trust/creator-thresholds", {
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
