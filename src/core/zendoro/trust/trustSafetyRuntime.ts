export type FraudSignal = {
  id: string;
  type:
    | "fake_review"
    | "suspicious_order"
    | "seller_risk"
    | "buyer_abuse"
    | "chargeback_risk"
    | "scam_keyword";
  severity: "low" | "medium" | "high" | "critical";
  score: number;
};

export type EnforcementAction = "allow" | "shadow_review" | "manual_review" | "restrict" | "block";

export function detectFakeReview(review: { velocity?: number; duplicateRatio?: number; verified?: boolean }): FraudSignal {
  const score = (review.velocity ?? 0) * 20 + (review.duplicateRatio ?? 0) * 100 + (review.verified === false ? 25 : 0);
  return { id: "fake-review", type: "fake_review", severity: score >= 80 ? "critical" : score >= 50 ? "high" : "medium", score };
}

export function detectSuspiciousOrder(order: { amount: number; vpn?: boolean; rapidAttempts?: number }): FraudSignal {
  const score = (order.amount > 2500 ? 40 : 10) + (order.vpn ? 30 : 0) + ((order.rapidAttempts ?? 0) * 10);
  return { id: "suspicious-order", type: "suspicious_order", severity: score >= 70 ? "critical" : score >= 45 ? "high" : "medium", score };
}

export function computeSellerRisk(seller: { disputes: number; refunds: number; fulfillmentScore: number }): FraudSignal {
  const score = seller.disputes * 12 + seller.refunds * 6 + Math.max(0, 100 - seller.fulfillmentScore);
  return { id: "seller-risk", type: "seller_risk", severity: score >= 75 ? "critical" : score >= 45 ? "high" : "medium", score };
}

export function detectBuyerAbuse(buyer: { refundRate: number; bans: number }): FraudSignal {
  const score = buyer.refundRate * 100 + buyer.bans * 25;
  return { id: "buyer-abuse", type: "buyer_abuse", severity: score >= 80 ? "critical" : score >= 50 ? "high" : "medium", score };
}

export function trackChargebackRisk(payment: { chargebacks: number; attempts: number }): FraudSignal {
  const ratio = payment.attempts <= 0 ? 0 : payment.chargebacks / payment.attempts;
  const score = ratio * 100;
  return { id: "chargeback-risk", type: "chargeback_risk", severity: score >= 50 ? "critical" : score >= 25 ? "high" : "medium", score };
}

export function detectScamKeywords(text: string): FraudSignal {
  const patterns = ["wire transfer only", "crypto only", "gift card", "telegram only", "off-platform"];
  const hits = patterns.filter((x) => text.toLowerCase().includes(x));
  return { id: "scam-keywords", type: "scam_keyword", severity: hits.length >= 2 ? "critical" : hits.length === 1 ? "high" : "low", score: hits.length * 40 };
}

export function decideEnforcement(signals: FraudSignal[]): EnforcementAction {
  const maxScore = Math.max(...signals.map((s) => s.score), 0);
  if (maxScore >= 90) return "block";
  if (maxScore >= 70) return "restrict";
  if (maxScore >= 50) return "manual_review";
  if (maxScore >= 30) return "shadow_review";
  return "allow";
}

export function buildManualReviewQueue(signals: FraudSignal[]) {
  return signals.filter((s) => s.score >= 50).map((signal) => ({
    queue: "zendoro-trust-review",
    signalType: signal.type,
    severity: signal.severity,
    score: signal.score
  }));
}

export function buildEnforcementAuditLog(action: EnforcementAction, signals: FraudSignal[]) {
  return { action, createdAt: new Date().toISOString(), signals };
}
