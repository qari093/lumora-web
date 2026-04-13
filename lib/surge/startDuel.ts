export async function startDuelRequest(duel: unknown) {
  try {
    const res = await fetch("/api/surge/duel/start", {
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
