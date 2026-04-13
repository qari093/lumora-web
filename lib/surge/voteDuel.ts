export async function voteDuel(input: {
  duel: unknown;
  side: "left" | "right";
  watchSeconds: number;
  minWatchSeconds?: number;
}) {
  try {
    const res = await fetch("/api/surge/duel/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return {
      status: res.status,
      data: await res.json(),
    };
  } catch {
    return null;
  }
}
