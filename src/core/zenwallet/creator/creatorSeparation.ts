export type CreatorStatus = "none" | "applied" | "approved";

export function canShowCreatorView(status: CreatorStatus) {
  return status === "applied" || status === "approved";
}

export function getCreatorViewLabel(status: CreatorStatus) {
  return canShowCreatorView(status) ? "Creator View" : "Become a Creator";
}

export type CreatorPayoutMethod = "paypal" | "wise" | "bank_transfer" | "manual_review";

export function availablePayoutMethods(country: string): CreatorPayoutMethod[] {
  if (country === "US" || country === "DE") return ["paypal", "wise", "bank_transfer"];
  return ["paypal", "wise", "manual_review"];
}
