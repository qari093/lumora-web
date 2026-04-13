export async function fetchCooldown(input: {
  lastActionAt?: number | null;
  cooldownMinutes?: number;
}) {
  try {
    const res = await fetch("/api/safety/cooldown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return await res.json();
  } catch {
    return null;
  }
}
