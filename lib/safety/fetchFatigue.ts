import type { FatigueInput } from "./fatigue";

export async function fetchFatigue(input: FatigueInput) {
  try {
    const res = await fetch("/api/safety/fatigue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return await res.json();
  } catch {
    return null;
  }
}
