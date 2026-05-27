import type { ZenWalletRegionGroup } from "../governance/types";

export type ZenWalletRegionPolicy = {
  readonly region: ZenWalletRegionGroup;
  readonly preferredPsps: readonly string[];
  readonly fallback: "paypal" | "manual_invoice" | "voucher";
  readonly taxMode: "stripe_tax" | "psp_tax" | "lumora_tax_rules";
  readonly creatorPayoutHint: readonly string[];
};

export const ZENWALLET_REGION_POLICIES: readonly ZenWalletRegionPolicy[] = [
  {
    region: "eu_eea_uk",
    preferredPsps: ["stripe", "paypal", "checkout_com"],
    fallback: "manual_invoice",
    taxMode: "stripe_tax",
    creatorPayoutHint: ["stripe_connect", "paypal", "wise"],
  },
  {
    region: "north_america",
    preferredPsps: ["stripe", "paypal"],
    fallback: "manual_invoice",
    taxMode: "stripe_tax",
    creatorPayoutHint: ["stripe_connect", "paypal", "wise"],
  },
  {
    region: "latam",
    preferredPsps: ["dlocal", "paypal"],
    fallback: "voucher",
    taxMode: "psp_tax",
    creatorPayoutHint: ["paypal", "wise"],
  },
  {
    region: "africa",
    preferredPsps: ["paystack", "flutterwave", "paypal"],
    fallback: "voucher",
    taxMode: "psp_tax",
    creatorPayoutHint: ["paypal", "wise", "regional_bank_transfer"],
  },
  {
    region: "india_south_asia",
    preferredPsps: ["razorpay", "stripe", "paypal"],
    fallback: "manual_invoice",
    taxMode: "lumora_tax_rules",
    creatorPayoutHint: ["paypal", "wise", "regional_bank_transfer"],
  },
  {
    region: "southeast_asia",
    preferredPsps: ["xendit", "checkout_com", "paypal"],
    fallback: "voucher",
    taxMode: "psp_tax",
    creatorPayoutHint: ["paypal", "wise", "regional_bank_transfer"],
  },
  {
    region: "middle_east",
    preferredPsps: ["checkout_com", "paypal"],
    fallback: "manual_invoice",
    taxMode: "psp_tax",
    creatorPayoutHint: ["paypal", "wise", "regional_bank_transfer"],
  },
  {
    region: "unsupported_manual",
    preferredPsps: [],
    fallback: "manual_invoice",
    taxMode: "lumora_tax_rules",
    creatorPayoutHint: ["manual_review_required"],
  },
] as const;

export function getZenWalletRegionPolicy(region: ZenWalletRegionGroup): ZenWalletRegionPolicy {
  const policy = ZENWALLET_REGION_POLICIES.find((candidate) => candidate.region === region);
  if (!policy) throw new Error(`Unsupported ZenWallet region policy: ${region}`);
  return policy;
}
