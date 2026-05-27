import type { GcmCapability } from "./types";

export const GCM_CAPABILITIES: GcmCapability[] = [
  {
    system: "gmar",
    capability: "persistent_game_state",
    required: true,
    ready: true,
    severity: "critical",
    message: "GMAR game state must persist safely."
  },
  {
    system: "gmar",
    capability: "matchmaking_runtime",
    required: true,
    ready: true,
    severity: "high",
    message: "GMAR matchmaking must be runtime-ready."
  },
  {
    system: "gmar",
    capability: "economy_claim_guard",
    required: true,
    ready: true,
    severity: "critical",
    message: "GMAR economy claims must be guarded."
  },
  {
    system: "gmar",
    capability: "realtime_presence",
    required: true,
    ready: false,
    severity: "medium",
    message: "GMAR realtime presence needs final live pressure validation."
  },
  {
    system: "creator",
    capability: "creator_onboarding",
    required: true,
    ready: true,
    severity: "high",
    message: "Creator onboarding must be available."
  },
  {
    system: "creator",
    capability: "creator_publishing",
    required: true,
    ready: true,
    severity: "high",
    message: "Creator publishing must be available."
  },
  {
    system: "creator",
    capability: "creator_analytics",
    required: true,
    ready: true,
    severity: "medium",
    message: "Creator analytics must be available."
  },
  {
    system: "creator",
    capability: "creator_safety_review",
    required: true,
    ready: true,
    severity: "critical",
    message: "Creator safety review must be enforced."
  },
  {
    system: "monetization",
    capability: "wallet_ledger_integrity",
    required: true,
    ready: true,
    severity: "critical",
    message: "Wallet ledger integrity must be validated."
  },
  {
    system: "monetization",
    capability: "payment_safety",
    required: true,
    ready: false,
    severity: "critical",
    message: "Payment safety must be fully real before public monetization."
  },
  {
    system: "monetization",
    capability: "ad_boundary_guard",
    required: true,
    ready: true,
    severity: "high",
    message: "Ad runtime boundaries must remain guarded."
  },
  {
    system: "monetization",
    capability: "reward_fraud_detection",
    required: true,
    ready: true,
    severity: "critical",
    message: "Reward and fraud detection must be active."
  },
  {
    system: "monetization",
    capability: "payout_safety",
    required: true,
    ready: false,
    severity: "critical",
    message: "Payout safety remains blocked until full compliance and verification."
  },
  {
    system: "monetization",
    capability: "transaction_replay_protection",
    required: true,
    ready: true,
    severity: "critical",
    message: "Transaction replay protection must be active."
  }
];
