export type PSP =
  | "stripe"
  | "paypal"
  | "dlocal"
  | "razorpay"
  | "paystack";

export function resolvePreferredPSP(country: string): PSP {
  if (country === "IN") return "razorpay";
  if (country === "NG") return "paystack";
  return "stripe";
}
