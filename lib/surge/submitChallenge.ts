export async function submitChallenge(input: {
  challengeId: string;
  creatorId: string;
  contentId: string;
}) {
  try {
    const res = await fetch("/api/surge/challenge/submit", {
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
