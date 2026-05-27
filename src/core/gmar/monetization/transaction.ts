import { isGmarProductAllowed } from "./products";

export function validateGmarPurchase(input: { product: string; grantsPower: boolean; refundable: boolean }) {
  if (!isGmarProductAllowed(input.product)) {
    return { ok: false, reason: "product_not_allowed" as const };
  }

  if (input.grantsPower) {
    return { ok: false, reason: "pay_to_win_blocked" as const };
  }

  if (!input.refundable) {
    return { ok: false, reason: "refund_policy_required" as const };
  }

  return { ok: true, reason: "approved" as const };
}
