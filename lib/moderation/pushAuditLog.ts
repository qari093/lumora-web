export async function pushAuditLog(input: {
  action: string;
  contentId: string;
  actor: string;
  outcome: "allow" | "review" | "block";
  reason?: string;
}) {
  try {
    const res = await fetch("/api/moderation/audit", {
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
