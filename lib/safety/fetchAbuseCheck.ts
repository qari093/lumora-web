import type { AbuseCheckInput } from "./abuseCheck";

export async function fetchAbuseCheck(input: AbuseCheckInput) {
  try {
    const res = await fetch("/api/safety/abuse-check", {
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
