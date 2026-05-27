export function shouldPrefetchAd(input: {
  userState: "green" | "yellow" | "red";
  nextSlotEligible: boolean;
  networkQuality: "low" | "medium" | "high";
}) {
  return input.userState !== "red" && input.nextSlotEligible && input.networkQuality !== "low";
}
