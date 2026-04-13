import type { BotCheckInput } from "./botCheck";

export async function fetchBotCheck(input: BotCheckInput) {
  try {
    const res = await fetch("/api/safety/bot-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    return await res.json();
  } catch {
    return null;
  }
}
