export async function enqueueChallengeJobRequest(input: {
  challengeId: string;
  submissionId: string;
  creatorId: string;
}) {
  try {
    const res = await fetch("/api/surge/challenge/queue", {
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
