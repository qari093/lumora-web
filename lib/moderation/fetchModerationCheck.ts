import type { ModerationInput } from "./moderationCheck";

export async function fetchModerationCheck(input: ModerationInput) {
  try {
    const res = await fetch("/api/moderation/check", {
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
