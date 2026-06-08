import { createFinancialConstitutionView } from "./treasuryConstitution";

export type LafsDashboardState = "SAFE" | "WATCH" | "REVIEW" | "FROZEN";

export interface LafsDashboardSnapshot {
  status: "LAFS_COMMAND_HEARTH_READY";
  state: LafsDashboardState;
  lensDefault: "OFF";
  paymentLiveMode: false;
  panels: string[];
  guards: {
    readOnlyDashboard: true;
    noMoneyMovementFromDashboard: true;
    humanApprovalRequired: true;
    paymentLiveMode: false;
    lumoraLensDefaultOff: true;
  };
}

export function createLafsDashboardSnapshot(): LafsDashboardSnapshot {
  return {
    status: "LAFS_COMMAND_HEARTH_READY",
    state: "SAFE",
    lensDefault: "OFF",
    paymentLiveMode: false,
    panels: [
      "Treasury Pulse",
      "Risk & Freeze Control",
      "Ledger Flow",
      "Payment Channels",
      "Approval Queue",
      "Operator Audit Trail",
      "Financial Tensions",
      "Constitution Explorer",
    ],
    guards: {
      readOnlyDashboard: true,
      noMoneyMovementFromDashboard: true,
      humanApprovalRequired: true,
      paymentLiveMode: false,
      lumoraLensDefaultOff: true,
    },
  };
}

export function createLafsCommandHearthModel() {
  return {
    snapshot: createLafsDashboardSnapshot(),
    constitution: createFinancialConstitutionView(),
    layout: {
      title: "LAFS Ω∞ Command Hearth",
      grid: "2x4",
      mode: "finance_ops_first",
      lumoraLens: {
        default: "OFF",
        allowed: true,
        content: ["daily_hash_note", "tension_whisper", "soft_state_gradient"],
        blockedFromCriticalPanels: true,
      },
    },
  };
}
