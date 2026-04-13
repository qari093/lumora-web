export type FakeEngagementResult = {
  signalId: string;
  isSuspicious: boolean;
  reasons: string[];
  score: number;
};

export function detectFakeEngagement(signal: any): FakeEngagementResult {
  const reasons: string[] = [];
  let score = 0;

  const views = Number(signal.views || 0);
  const likes = Number(signal.likes || 0);
  const comments = Number(signal.comments || 0);
  const shares = Number(signal.shares || 0);

  if (views > 0) {
    const likeRatio = likes / views;
    if (likeRatio > 0.9) {
      reasons.push("abnormal_like_ratio");
      score += 30;
    }
  }

  if (comments > likes * 5) {
    reasons.push("comment_spam_pattern");
    score += 20;
  }

  if (shares > views) {
    reasons.push("share_exceeds_views");
    score += 25;
  }

  if (views < 100 && likes > 1000) {
    reasons.push("like_spike_low_views");
    score += 40;
  }

  const isSuspicious = score >= 30;

  return {
    signalId: String(signal.id || "unknown"),
    isSuspicious,
    reasons,
    score,
  };
}
