export async function createDuel(input: {
  mode?: "chill" | "surge";
  leftCreatorId: string;
  leftContentId: string;
  rightCreatorId: string;
  rightContentId: string;
}) {
  try {
    const res = await fetch("/api/surge/duel", {
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
