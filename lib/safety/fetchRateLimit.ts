import type { RateLimitInput } from "./rateLimit";

export async function fetchRateLimit(input: RateLimitInput) {
  try {
    const res = await fetch("/api/safety/rate-limit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const json = await res.json();
    return {
      status: res.status,
      data: json,
    };
  } catch {
    return null;
  }
}
