export function evaluateViewerRetention(input: { watchSeconds: number; reactions: number; returns: number }) {
  const score = input.watchSeconds * 0.5 + input.reactions * 3 + input.returns * 15;
  return { score, retained: score >= 60, nudgeReady: score < 60, mechanics: ["afterglow", "streak_soft", "room_memory", "creator_callback"] };
}
