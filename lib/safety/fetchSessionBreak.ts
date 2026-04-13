import type { SessionBreakInput } from "./sessionBreak";

export async function fetchSessionBreak(input: SessionBreakInput) {
  try {
    const res = await fetch("/api/safety/session-break", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return await res.json();
  } catch {
    return null;
  }
}
