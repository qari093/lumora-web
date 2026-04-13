export async function pushReviewQueue(input: {
  contentId: string;
  reason: string;
  priority?: "low" | "medium" | "high";
  source?: "surge" | "risk_mode" | "moderation";
}) {
  try {
    const res = await fetch("/api/moderation/review-queue", {
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
