export async function fetchBudgetGuard(input: {
  spent: number;
  budget: number;
}) {
  try {
    const res = await fetch("/api/ads/budget-guard", {
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
