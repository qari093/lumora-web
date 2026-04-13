export async function resolveDuelRequest(duel: unknown) {
  try {
    const res = await fetch("/api/surge/duel/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ duel }),
    });

    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
