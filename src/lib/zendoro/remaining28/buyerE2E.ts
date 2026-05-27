export const zendoroBuyerE2EFlow = [
  "browse",
  "productDetail",
  "addToCart",
  "checkout",
  "payment",
  "confirmation",
  "orderHistory",
  "reviewAfterPurchase",
  "loadingStates",
  "emptyStates",
  "failureStates",
  "mobilePolish",
] as const;

export function validateZendoroBuyerE2EFlow() {
  return zendoroBuyerE2EFlow.length === 12;
}

export function getZendoroBuyerNextStep(current: string) {
  const index = zendoroBuyerE2EFlow.indexOf(current as never);
  return index >= 0 ? zendoroBuyerE2EFlow[index + 1] ?? "complete" : "browse";
}
