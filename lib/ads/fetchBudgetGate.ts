export async function fetchBudgetGate(input: {
  adId: string;
  spent: number;
  budget: number;
}) {
  try {
    const res = await fetch("/api/ads/budget-gate", {
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
