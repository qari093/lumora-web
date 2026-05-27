export type MonetizationMode =
  | "disabled"
  | "native"
  | "rewarded";

export interface MonetizationSignal {
  userId: string;
  itemId: string;
  mode: MonetizationMode;
  eligible: boolean;
  value: number;
}

export interface MonetizationDecision {
  allowed: boolean;
  mode: MonetizationMode;
  estimatedValue: number;
  reason: string;
}
