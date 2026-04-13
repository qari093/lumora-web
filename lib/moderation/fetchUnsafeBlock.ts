import type { UnsafeContentInput } from "./blockUnsafeContent";

export async function fetchUnsafeBlock(input: UnsafeContentInput) {
  try {
    const res = await fetch("/api/moderation/block", {
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
