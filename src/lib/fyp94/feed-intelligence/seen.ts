const KEY = "lumora_fyp94_seen_ids";

export function readFyp94SeenIds(limit = 100): string[] {
  if (typeof window === "undefined") return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed.slice(-limit) : [];
  } catch {
    return [];
  }
}

export function writeFyp94SeenId(id: string, limit = 100): void {
  if (typeof window === "undefined") return;

  const next = [...readFyp94SeenIds(limit), id].slice(-limit);
  window.localStorage.setItem(KEY, JSON.stringify([...new Set(next)]));
}
