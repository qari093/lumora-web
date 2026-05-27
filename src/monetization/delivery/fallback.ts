export function resolveAdDeliveryFallback(input: {
  adAvailable: boolean;
  userState: "green" | "yellow" | "red";
}) {
  if (input.userState === "red") return { action: "skip_ad" as const };
  if (!input.adAvailable) return { action: "continue_content" as const };
  return { action: "serve_ad" as const };
}
